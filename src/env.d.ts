/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_WHATSAPP?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
