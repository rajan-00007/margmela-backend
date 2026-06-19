import 'styled-components';
import { AppTheme } from './themes';

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
