/**
 * weui-react-native
 *
 * A faithful React Native port of Tencent's WeUI design system.
 * Provides 30+ components with full dark mode support.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, Button, Cell, Cells } from 'weui-react-native';
 *
 * export default function App() {
 *   return (
 *     <ThemeProvider>
 *       <Cells title="Buttons">
 *         <Button type="primary">Primary Button</Button>
 *         <Button type="default">Default Button</Button>
 *       </Cells>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// ============================================================
// Theme System
// ============================================================
export {
  ThemeProvider,
  useTheme,
  useThemeMode,
  lightTheme,
  darkTheme,
  buildTheme,
  brandColors,
  lightColors,
  darkColors,
  fontSizes,
  lineHeights,
  typography,
  spacing,
  borderRadii,
  buttonHeights,
  sizes,
} from './theme';

export type {
  Theme,
  ThemeMode,
  ThemeColors,
  SemanticColors,
  BrandColors,
  ThemePreference,
  ThemeContextValue,
  ThemeProviderProps,
  FontSizes,
  LineHeights,
  Typography,
  Spacing,
  BorderRadii,
  ButtonHeights,
  Sizes,
} from './theme';

// ============================================================
// Base Components
// ============================================================
export { Icon } from './components/Icon';
export type { IconProps, IconType } from './components/Icon';

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Cell, Cells, CellHeader, CellBody, CellFooter } from './components/Cell';
export type {
  CellProps,
  CellsProps,
  CellHeaderProps,
  CellBodyProps,
  CellFooterProps,
} from './components/Cell';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

// ============================================================
// Form Components
// ============================================================
export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { WeuiSwitch as Switch } from './components/Switch';
export type { WeuiSwitchProps as SwitchProps } from './components/Switch';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { Uploader } from './components/Uploader';
export type { UploaderProps, UploaderFile } from './components/Uploader';

export { Picker } from './components/Picker';
export type { PickerProps, PickerColumn } from './components/Picker';

export { Form } from './components/Form';
export type { FormProps, FormRule } from './components/Form';

// ============================================================
// Feedback Components
// ============================================================
export { Dialog, Alert, Confirm } from './components/Dialog';
export type { DialogProps, DialogButton, AlertProps, ConfirmProps } from './components/Dialog';

export { ActionSheet } from './components/ActionSheet';
export type { ActionSheetProps, ActionSheetItem } from './components/ActionSheet';

export { Toast } from './components/Toast';
export type { ToastProps, ToastType } from './components/Toast';

export { TopTips } from './components/TopTips';
export type { TopTipsProps } from './components/TopTips';

export { Loading } from './components/Loading';
export type { LoadingProps } from './components/Loading';

export { Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

export { HalfScreenDialog } from './components/HalfScreenDialog';
export type { HalfScreenDialogProps } from './components/HalfScreenDialog';

// ============================================================
// Navigation Components
// ============================================================
export { Navbar } from './components/Navbar';
export type { NavbarProps, NavbarItem } from './components/Navbar';

export { Tabbar } from './components/Tabbar';
export type { TabbarProps, TabbarItem } from './components/Tabbar';

export { SearchBar } from './components/SearchBar';
export type { SearchBarProps } from './components/SearchBar';

// ============================================================
// Display Components
// ============================================================
export { Grid } from './components/Grid';
export type { GridProps, GridItem } from './components/Grid';

export { Panel } from './components/Panel';
export type { PanelProps } from './components/Panel';

export { Preview } from './components/Preview';
export type { PreviewProps, PreviewItem } from './components/Preview';

export { Steps } from './components/Steps';
export type { StepsProps, StepItem, StepStatus } from './components/Steps';

export { Loadmore } from './components/Loadmore';
export type { LoadmoreProps } from './components/Loadmore';

export { Article, ArticleParagraph, ArticleHeading } from './components/Article';
export type {
  ArticleProps,
  ArticleParagraphProps,
  ArticleHeadingProps,
} from './components/Article';

export { MediaBox } from './components/MediaBox';
export type { MediaBoxProps } from './components/MediaBox';

export { Gallery } from './components/Gallery';
export type { GalleryProps, GalleryImage } from './components/Gallery';

export { Msg } from './components/Msg';
export type { MsgProps } from './components/Msg';

export { Footer } from './components/Footer';
export type { FooterProps, FooterLink } from './components/Footer';

export { InformationBar } from './components/InformationBar';
export type { InformationBarProps } from './components/InformationBar';

// ============================================================
// Layout Components
// ============================================================
export { Flex, FlexItem } from './components/Flex';
export type { FlexProps, FlexItemProps } from './components/Flex';
