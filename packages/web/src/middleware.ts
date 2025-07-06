import { chain } from "./middleware/chain";
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';

export default chain([withAuthMiddleware, withI18nMiddleware]);

export const config = {
  matcher: [
    // Incluir solo las rutas que necesitan procesamiento de i18n
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
  ],
};
