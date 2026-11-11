import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HOTMART_HOTTOK = Deno.env.get("HOTMART_HOTTOK");
const TICTO_TOKEN = Deno.env.get("TICTO_TOKEN");

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform") || "hotmart";

    let email = "";
    let name = "";
    let event = "";
    let transactionId = "";
    const planTarget = "pro_annual";

    if (platform === "hotmart") {
      const hottok = body.hottok || req.headers.get("x-hotmart-hottok");
      if (HOTMART_HOTTOK && hottok !== HOTMART_HOTTOK) {
        return new Response(JSON.stringify({ error: "Invalid Hottok" }), { status: 401 });
      }

      event = body.event;
      email = body.data?.buyer?.email?.toLowerCase().trim();
      name = body.data?.buyer?.name || "";
      transactionId = body.data?.purchase?.transaction || "";
    } else if (platform === "ticto" || platform === "kiwify") {
      event = body.status || body.event;
      email = (body.customer?.email || body.buyer?.email)?.toLowerCase().trim();
      name = body.customer?.name || body.buyer?.name || "";
      transactionId = body.order_id || body.transaction || "";
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Email missing" }), { status: 400 });
    }

    const isApproval = [
      "PURCHASE_APPROVED", 
      "approved", 
      "paid", 
      "order_approved"
    ].includes(event);

    const isCancellation = [
      "PURCHASE_REFUNDED", 
      "PURCHASE_CANCELED", 
      "refunded", 
      "canceled", 
      "chargeback"
    ].includes(event);

    if (isApproval) {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      let user = userList.users.find((u) => u.email?.toLowerCase() === email);

      if (!user) {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: name, origin: platform },
        });

        if (createError) throw createError;
        user = newUser.user;

        await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email,
        });
      }

      await supabaseAdmin
        .from("profiles")
        .upsert({
          id: user.id,
          email,
          plan: planTarget,
          subscription_status: "active",
          platform,
          platform_subscription_id: transactionId,
          updated_at: new Date().toISOString(),
        });

      return new Response(JSON.stringify({ status: "success", action: "granted", userId: user.id }), { status: 200 });
    }

    if (isCancellation) {
      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "inactive",
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      return new Response(JSON.stringify({ status: "success", action: "revoked" }), { status: 200 });
    }

    return new Response(JSON.stringify({ status: "ignored_event", event }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
