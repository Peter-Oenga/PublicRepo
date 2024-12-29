<template>
    <div class="document-page p-6" v-if="!loading && activeDocument">
        <BreadcrumbComponent v-if="!loading" />
        <!-- Document Header -->
        <div class="bg-white shadow rounded-lg p-6 mb-6" v-if="activeDocument">
            <h1 class="text-3xl font-bold mb-2">{{ activeDocument?.name }}</h1>
            <p class="text-gray-700 mb-4">
                {{ activeDocument?.description || "No description available" }}
            </p>
            <div class="my-2">
                <span
                    v-for="tag in activeDocument?.tags"
                    :key="tag.id"
                    class="inline-block px-3 py-1 mr-2 mb-2 text-sm bg-gray-700 text-white rounded-full"
                >
                    {{ tag?.name }}
                </span>
            </div>

            <!-- User Info -->
            <div class="flex items-center space-x-4 mb-6">
                <img
                    v-if="activeDocument?.user?.avatar"
                    :src="formattedUserAvatar"
                    alt="User Avatar"
                    class="w-12 h-12 rounded-full"
                />
                <div>
                    <p class="text-lg font-semibold">
                        {{ activeDocument?.user?.first_name }}
                        {{ activeDocument?.user?.last_name }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{
                            new Date(
                                activeDocument.created_at
                            ).toLocaleDateString()
                        }}
                    </p>
                </div>
            </div>

            <!-- Document Actions -->
            <div class="flex space-x-4 mb-6">
                <button
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                    @click="handleDownloadDocument"
                >
                    <font-awesome-icon icon="download" class="mr-2" />
                    Download
                </button>
                <button
                    class="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center"
                    @click="showDocumentModal = true"
                >
                    <font-awesome-icon icon="edit" class="mr-2" />
                    Edit
                </button>
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
                    @click="showVersionModal = true"
                >
                    <font-awesome-icon icon="upload" class="mr-2" />
                    Upload New Version
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                    @click="showReportModal = true"
                >
                    <font-awesome-icon icon="plus" class="mr-2" />
                    Add Report Data
                </button>
                <button
                    class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                    @click="confirmDelete"
                >
                    <font-awesome-icon icon="trash" class="mr-2" />
                    Delete
                </button>
            </div>
        </div>

        <!-- Version History -->
        <div class="bg-white shadow rounded-lg p-6" v-if="activeDocument">
            <h2 class="text-2xl font-bold mb-4">Version History</h2>
            <table class="w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-100 border-b">
                        <th class="px-4 py-2 text-left">Version</th>
                        <th class="px-4 py-2 text-left">Date</th>
                        <th class="px-4 py-2 text-left">Description</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="version in activeDocument.versions || []"
                        :key="version.id"
                        class="border-b"
                    >
                        <td class="px-4 py-2">{{ version.version_number }}</td>
                        <td class="px-4 py-2">
                            {{
                                new Date(
                                    version.created_at
                                ).toLocaleDateString()
                            }}
                        </td>
                        <td class="px-4 py-2">{{ version.description }}</td>
                        <td class="px-4 py-2">
                            <button
                                class="text-blue-500 hover:underline mr-2"
                                @click="
                                    handleDownloadDocumentVersion(version.id)
                                "
                            >
                                <font-awesome-icon icon="download" />
                                Download
                            </button>
                            <button
                                class="text-red-500 hover:underline"
                                @click="
                                    handleRestoreDocumentVersion(version.id)
                                "
                            >
                                <font-awesome-icon icon="undo" />
                                Restore
                            </button>
                        </td>
                    </tr>
                    <tr
                        v-if="
                            !(
                                activeDocument.versions &&
                                activeDocument.versions.length
                            )
                        "
                    >
                        <td
                            colspan="4"
                            class="px-4 py-2 text-center text-gray-500"
                        >
                            No version history available
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Report Data Section -->
        <div class="bg-white shadow rounded-lg p-6" v-if="activeDocument">
            <h2 class="text-2xl font-bold mb-4">Report Data</h2>

            <table class="w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-100 border-b">
                        <th class="px-4 py-2 text-left">Municipality</th>
                        <th class="px-4 py-2 text-left">Participants</th>
                        <th class="px-4 py-2 text-left">Workshops</th>
                        <th class="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loop through the reports array -->
                    <tr
                        v-for="report in reports"
                        :key="report.id"
                        class="border-b"
                    >
                        <td class="px-4 py-2">{{ report.municipality }}</td>
                        <td class="px-4 py-2">{{ report.participants }}</td>
                        <td class="px-4 py-2">{{ report.workshops }}</td>
                        <td class="px-4 py-2">
                            <!-- Edit Button -->
                            <button
                                class="text-blue-500 hover:underline"
                                @click="showEditReportModal(report)"
                            >
                                <font-awesome-icon icon="edit" />
                                Edit
                            </button>

                            <!-- Delete Button -->
                            <button
                                class="text-red-500 hover:underline"
                                @click="handleDeleteReport(report.id)"
                            >
                                <font-awesome-icon icon="trash" />
                                Delete
                            </button>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-if="!reports || !reports.length">
                        <td
                            colspan="4"
                            class="px-4 py-2 text-center text-gray-500"
                        >
                            No report data available
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Document Version Creation Modal -->
        <DocumentVersionCreationModal
            :isVisible="showVersionModal"
            @close="showVersionModal = false"
        />

        <!-- Report Data Modal -->
        <ReportDataModal
            :isVisible="showReportModal"
            @close="showReportModal = false"
            :report="editingReport"
        />

        <!-- Document Creation Modal -->
        <DocumentCreationModal
            :isVisible="showDocumentModal"
            :isEditing="true"
            :document="activeDocument"
            @close="showDocumentModal = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//import axios from '@/axios'; // Import the axios instance
import DocumentVersionCreationModal from "@/components/DocumentVersionCreationModal.vue"; // Import the modal
import DocumentCreationModal from "@/components/DocumentCreationModal.vue";
import ReportDataModal from "@/components/ReportDataModal.vue";
import BreadcrumbComponent from "@/components/BreadcrumbComponent.vue";

export default {
    components: {
        DocumentVersionCreationModal, // Register the modal component
        DocumentCreationModal,
        ReportDataModal,
        BreadcrumbComponent,
    },
    data() {
        return {
            showDocumentModal: false,
            showVersionModal: false, // Control the visibility of the modal
            showReportModal: false,
            editingReport: null,
        };
    },
    computed: {
        ...mapGetters("collection", ["activeDocument", "reports", "rootId"]),
        ...mapGetters("global", ["loading"]),
        formattedUserAvatar() {
            const baseUrl = process.env.VUE_APP_BACKEND_URL || "/";
            return this.activeDocument.user?.avatar
                ? `${baseUrl}storage/${this.activeDocument.user.avatar}`
                : `${baseUrl}storage/avatars/default-avatar.png`; // Use the default avatar if none is provided
        },
    },
    methods: {
        ...mapActions("collection", [
            "deleteDocument",
            "fetchDocumentById",
            "fetchReportsByDocumentId",
            "deleteReport",
        ]),
        ...mapActions("document", [
            "downloadDocument",
            "downloadDocumentVersion",
            "restoreDocumentVersion",
        ]),
        async handleDownloadDocumentVersion(versionId) {
            const documentId = this.activeDocument.id;
            await this.downloadDocumentVersion({ documentId, versionId });
        },
        async handleRestoreDocumentVersion(versionId) {
            const documentId = this.activeDocument.id;
            await this.restoreDocumentVersion({ documentId, versionId });
        },
        async handleDownloadDocument() {
            const documentId = this.activeDocument.id;
            await this.downloadDocument(documentId);
        },
        confirmDelete() {
            if (
                confirm(
                    "Are you sure you want to delete this document? This action cannot be undone."
                )
            ) {
                this.deleteDocument(this.activeDocument.id)
                    .then(() => {
                        // Handle successful deletion (e.g., navigate away or show a success message)
                        this.$router.push({
                            name: "Collection",
                            params: { id: this.rootId },
                        });
                    })
                    .catch((error) => {
                        console.error("Error deleting the document:", error);
                        // Handle the error, e.g., show a notification to the user
                    });
            }
        },
        showEditReportModal(report) {
            this.editingReport = report;
            this.showReportModal = true;
        },

        // ✅ Accepts reportId as a parameter
        handleDeleteReport(reportId) {
            if (confirm("Are you sure you want to delete this report?")) {
                this.deleteReport(reportId)
                    .then(() => console.log("Report deleted successfully"))
                    .catch((error) =>
                        console.error("Failed to delete report", error)
                    );
            }
        },
    },
    watch: {
        "$route.params.id": {
            async handler(newId) {
                // Call your API method here
                await this.fetchDocumentById(newId);
                await this.fetchReportsByDocumentId(newId);
            },
            immediate: true, // This will call the handler immediately on component mount
        },
    },
};
</script>
