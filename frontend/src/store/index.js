import { createStore } from "vuex";
import collection from "./modules/collection";
import event from "./modules/event";
import eventOutcome from "./modules/eventOutcome";
import tag from "./modules/tag";
import global from "./modules/global";
import role from "./modules/role";
import permission from "./modules/permission";
import user from "./modules/user";
import document from "./modules/document";
import breadcrumb from "./modules/breadcrumb";
import project from "./modules/project";
import audience from "./modules/audience";
import activity from "./modules/activity";
import expectedResult from "./modules/expectedResult";
import achievement from "./modules/achievement";

export default createStore({
    modules : {
     global,
     collection,
     event,
     eventOutcome,
     tag,
     role,
     permission,
     user,
     document,
     breadcrumb,
     project,
     audience,
     activity,
     expectedResult,
     achievement
    } 
 });