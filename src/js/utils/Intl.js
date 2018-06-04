import { IntlProvider } from 'react-intl';
import localeStore from '../stores/LocaleStore';

const locale = localeStore.language;
const { messages } = localeStore;

const intlProvider = new IntlProvider({ locale, messages });

// Because react-intl does not exposed all of its translation API outside components
// We will export an instance of intl to use anywhere outside components

export default intlProvider.getChildContext().intl;
