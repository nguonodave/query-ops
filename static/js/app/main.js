import { checkAuthStatusAndRenderUi } from "./auth.js";

export const domain = "learn.zone01kisumu.ke"

export async function initializeApp() {
  await checkAuthStatusAndRenderUi()
}

initializeApp()

