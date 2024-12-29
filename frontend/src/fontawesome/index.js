import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTimes, faBars, faArrowLeft, faBell, faTrash, faCalendar,
    faUser, faUsers, faHome, faXmark, faPlus, faFolderPlus, faFolder, faCalendarPlus,
    faDownload, faShare, faEdit, faUpload, faUndo, faCodeCompare, faListAlt,
    faCalendarDay, faMapMarkerAlt, faKey, faBriefcase, faEye, faTag, faPowerOff,
    faPen, faPhone, faEnvelope, faFileAlt } from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(faSearch, faTimes, faBars, faArrowLeft, faTrash, faCalendar,
    faBell, faUser, faUsers, faHome, faXmark, faPlus, faFolder, faCalendarPlus,
    faFolderPlus, faDownload, faShare, faEdit, faUpload, faUndo, faCodeCompare,
    faKey, faEye, faListAlt, faCalendarDay, faMapMarkerAlt, faTag, faPowerOff,
    faPen, faPhone, faEnvelope, faBriefcase, faFileAlt); // Add faFileAlt here

// Register the FontAwesomeIcon component globally
export { FontAwesomeIcon };
