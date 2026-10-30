# Real AI chatbot setup

The chatbot now calls the Supabase Edge Function at:

`https://tlcmismeirypsyhwrwiw.supabase.co/functions/v1/chat`

Deploy `supabase/functions/chat/index.ts`, then configure the function secret:

```bash
supabase secrets set OPENAI_API_KEY=your_key_here OPENAI_MODEL=gpt-4o-mini
supabase functions deploy chat
```

Never place `OPENAI_API_KEY` in `chatbot.js` or any HTML file. Until the Edge Function is deployed and configured, the chatbot automatically uses its local Crop Land fallback responses.