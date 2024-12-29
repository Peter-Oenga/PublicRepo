<template>
    <div id="dashboard">
        <HeaderComponent @toggle-sidebar="toggleSidebar" />
        <div class="content">
            <SidebarComponent
                :menu-items="menuItems"
                :is-overlay="isMobileOverlayVisible"
                @close-overlay="closeOverlay"
                @create-document="openDocumentCreationModal"
                @create-collection="openCollectionCreationModal"
                @create-event="openEventCreationModal"
                @create-event-outcome="openEventOutcomeModal"
                @create-tag="showTagModal = true"
                @create-role="showRoleModal = true"
                @create-project="showProjectModal = true"
                @create-audience="showAudienceModal = true"
            />
            <main @click.self="closeOverlay">
                <!-- Nested route outlet -->
                <router-view @click.self="closeOverlay" />
            </main>
        </div>
        <DocumentCreationModal
            :is-visible="showDocumentCreationModal"
            @close="closeDocumentCreationModal"
            @create="addDocument"
        />
        <CreateCollectionModal
            :is-visible="showCollectionCreationModal"
            @close="closeCollectionCreationModal"
            @create="addCollection"
        />
        <EventCreationModal
            :is-visible="showEventCreationModal"
            @close="closeEventCreationModal"
        />
        <EventOutcomeModal
            :is-visible="showEventOutcomeModal"
            @close="closeEventOutcomeModal"
        />
        <TagCreationModal
            :is-visible="showTagModal"
            @close="showTagModal = false"
        />
        <RoleCreationModal
            :is-visible="showRoleModal"
            @close="showRoleModal = false"
        />
        <CreateProjectModal
            :is-visible="showProjectModal"
            @close="showProjectModal = false"
        />
        <CreateAudienceModal
            :is-visible="showAudienceModal"
            @close="showAudienceModal = false"
        />
        <SpinnerComp :loading="loading" />
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import SidebarComponent from "@/components/SidebarComponent.vue";
import DocumentCreationModal from "@/components/DocumentCreationModal.vue";
import CreateCollectionModal from "@/components/CreateCollectionModal.vue";
import EventCreationModal from "@/components/EventCreationModal.vue";
import EventOutcomeModal from "@/components/EventOutcomeModal.vue"; // Import the new modal
import TagCreationModal from "@/components/TagCreationModal.vue";
import RoleCreationModal from "@/components/RoleCreationModal.vue";
import CreateProjectModal from "@/components/CreateProjectModal.vue";
import CreateAudienceModal from "@/components/CreateAudienceModal.vue";
import SpinnerComp from "@/components/SpinnerComp.vue";
import { mapGetters } from "vuex";

export default {
    name: "DashboardPage",
    components: {
        HeaderComponent,
        SidebarComponent,
        DocumentCreationModal,
        CreateCollectionModal,
        EventCreationModal,
        EventOutcomeModal, // Register the new modal component
        TagCreationModal,
        RoleCreationModal,
        CreateProjectModal,
        CreateAudienceModal,
        SpinnerComp,
    },
    computed: {
        ...mapGetters("global", ["loading"]), // Use loading getter from Vuex
    },
    data() {
        return {
            menuItems: [
                {
                    id: 2,
                    icon: "folder",
                    label: "Collections",
                    route: "Collection",
                },
                { id: 3, icon: "calendar", label: "Events", route: "Event" },
                {
                    id: 4,
                    icon: "file-alt",
                    label: "Documents",
                    route: "Document",
                },
                { id: 5, icon: "tag", label: "Tags", route: "Tag" },
                { id: 6, icon: "user", label: "Profile", route: "UserDetail" },
                {
                    id: 7,
                    icon: "key",
                    label: "Roles & Permissions",
                    route: "Role",
                },
                {
                    id: 8,
                    icon: "briefcase",
                    label: "Projects",
                    route: "Project",
                },
                { id: 9, icon: "eye", label: "Audience", route: "Audience" },
                // Add more menu items as needed
            ],
            isMobileOverlayVisible: false,
            showDocumentCreationModal: false,
            showCollectionCreationModal: false,
            showEventCreationModal: false, // For EventCreationModal visibility
            showEventOutcomeModal: false, // For EventOutcomeModal visibility
            showTagModal: false,
            showRoleModal: false,
            showProjectModal: false,
            showAudienceModal: false,
        };
    },
    methods: {
        toggleSidebar() {
            if (window.innerWidth >= 1024) {
                this.isMobileOverlayVisible = false;
            } else {
                this.isMobileOverlayVisible = !this.isMobileOverlayVisible;
            }
        },
        closeOverlay() {
            this.isMobileOverlayVisible = false;
        },
        handleResize() {
            if (window.innerWidth >= 1024) {
                this.isMobileOverlayVisible = false;
            }
        },
        openDocumentCreationModal() {
            this.showDocumentCreationModal = true;
        },
        closeDocumentCreationModal() {
            this.showDocumentCreationModal = false;
        },
        addDocument(document) {
            this.$store.dispatch("addDocument", document);
        },
        openCollectionCreationModal() {
            this.showCollectionCreationModal = true;
        },
        closeCollectionCreationModal() {
            this.showCollectionCreationModal = false;
        },
        addCollection(collection) {
            this.$store.dispatch("collection/createCollection", collection);
        },
        openEventCreationModal() {
            this.showEventCreationModal = true; // Show the EventCreationModal
        },
        closeEventCreationModal() {
            this.showEventCreationModal = false; // Hide the EventCreationModal
        },
        addEvent(event) {
            this.$store.dispatch("event/createEvent", event); // Dispatch the event creation
        },
        openEventOutcomeModal() {
            this.showEventOutcomeModal = true; // Show the EventOutcomeModal
        },
        closeEventOutcomeModal() {
            this.showEventOutcomeModal = false; // Hide the EventOutcomeModal
        },
        addEventOutcome(eventOutcome) {
            this.$store.dispatch(
                "eventOutcome/createEventOutcome",
                eventOutcome
            ); // Dispatch the event outcome creation
        },
    },
    mounted() {
        window.addEventListener("resize", this.handleResize);
        console.log("Dashboard Menu Items:", this.menuItems);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>

<style scoped>
#dashboard {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.content {
    display: flex;
    flex: 1;
}

header {
    width: 100%;
}

main {
    flex: 1;
    padding: 1rem;
    background-color: white;
}

@media (max-width: 1023px) {
    .content .SidebarComponent {
        display: none;
    }

    .content .SidebarComponent.overlay {
        display: block;
    }
}
</style>
