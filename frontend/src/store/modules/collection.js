import axios from "@/axios";

const state = {
    activeCollection: null,
    activeDocument: null,
    rootId: null,
    collections: [],
    errors: {},
    reports: [],
};

const mutations = {
    SET_ACTIVE_COLLECTION(state, collection) {
        state.activeCollection = collection;
        console.log(state.activeCollection);
    },
    SET_ACTIVE_DOCUMENT(state, document) {
        state.activeDocument = document;
    },
    SET_REPORTS(state, reports) {
        state.reports = reports;
    },
    SET_ROOT_ID(state, rootId) {
        state.rootId = rootId;
    },
    SET_COLLECTIONS(state, collections) {
        state.collections = collections;
    },
    SET_ERRORS(state, errors) {
        state.errors = errors;
    },
    CLEAR_ERRORS(state) {
        state.errors = {};
    },
};

const actions = {
    async fetchCollectionById(
        { commit, dispatch },
        { collectionId, tag, search }
    ) {
        try {
            dispatch("global/setLoading", true, { root: true });
            console.log(collectionId, tag, search);
            const response = await axios.get(
                `/collections/${collectionId}?tag=${tag}&search=${search}`
            );
            commit("SET_ACTIVE_COLLECTION", response.data);
        } catch (error) {
            console.error("Failed to fetch collection:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true });
        }
    },

    async fetchDocumentById({ commit, dispatch }, documentId) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            const response = await axios.get(`/documents/${documentId}`);
            console.log("Document fetched:", response.data);
            commit("SET_ACTIVE_DOCUMENT", response.data);
        } catch (error) {
            console.error("Failed to fetch document:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },

    async fetchReportsByDocumentId({ commit, dispatch }, documentId) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            const response = await axios.get(
                `/reports/by-document/${documentId}`
            );
            console.log("Reports fetched:", response.data);
            commit("SET_REPORTS", response.data); // Store reports in state
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async setActiveCollection({ commit }, collection) {
        commit("SET_ACTIVE_COLLECTION", collection);
    },
    async fetchRootCollection({ dispatch }, { tag, search }) {
        try {
            dispatch("global/setLoading", true, { root: true });
            const response = await axios.get(
                `/collections/root?tag=${tag}&search=${search}`
            );
            const rootCollection = response.data;
            console.log(rootCollection);
            await dispatch("setActiveCollection", rootCollection);
        } catch (error) {
            console.error("Failed to fetch root collection:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true });
        }
    },
    async createCollection({ commit, dispatch, state }, collectionData) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");
            const parentId = state.activeCollection
                ? state.activeCollection.id
                : null;

            await axios.post("/collections", {
                ...collectionData,
                parent_id: parentId,
            });

            if (parentId === null) {
                await dispatch("fetchRootCollection", { tag: "", search: "" });
            } else {
                await dispatch("fetchCollectionById", {
                    collectionId: parentId,
                    tag: "",
                    search: "",
                });
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message:
                        "Failed to create collection. Please try again later.",
                });
            }
            console.error("Failed to create collection:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async createDocument({ commit, state, dispatch }, documentData) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const collectionId = state.activeCollection
                ? state.activeCollection.id
                : null;

            const formData = new FormData();
            formData.append("name", documentData.name);
            formData.append("description", documentData.description);
            formData.append("file", documentData.file);
            formData.append("collection_id", collectionId);
            documentData.tag_ids.forEach((tagId) => {
                formData.append("tag_ids[]", tagId);
            });
            const response = await axios.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
            await dispatch("fetchCollectionById", {
                collectionId,
                tag: "",
                search: "",
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message:
                        "Failed to create document. Please try again later.",
                });
            }
            console.error("Failed to create document:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async uploadDocumentVersion(
        { commit, state, dispatch },
        { file, description }
    ) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const documentId = state.activeDocument.id;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("description", description);

            await axios.post(`/documents/${documentId}/versions`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await dispatch("fetchDocumentById", documentId); // Refresh the active document
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message:
                        "Failed to upload document version. Please try again later.",
                });
            }
            console.error("Failed to upload document version:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async updateDocument({ commit, dispatch }, documentData) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const collectionId = state.activeCollection
                ? state.activeCollection.id
                : null;
            const payload = { ...documentData, collection_id: collectionId };
            await axios.post(`/documents/${documentData.id}/update`, payload);

            await dispatch("fetchDocumentById", documentData.id); // Fetch the updated document
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message:
                        "Failed to update document. Please try again later.",
                });
            }
            console.error("Failed to update document:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async deleteDocument({ commit, state, dispatch }, documentId) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            await axios.post(`/documents/${documentId}/delete`);

            if (state.activeCollection) {
                await dispatch("fetchCollectionById", {
                    collectionId: state.activeCollection.id,
                    tag: "",
                    search: "",
                });
            } else {
                await dispatch("fetchRootCollection", { tag: "", search: "" });
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message:
                        "Failed to delete document. Please try again later.",
                });
            }
            console.error("Failed to delete document:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async createReport({ commit, state, dispatch }, reportData) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const documentId = state.activeDocument.id;

            const formData = new FormData();
            formData.append("municipality", reportData.municipality);
            formData.append("participants", reportData.participants);
            formData.append("workshops", reportData.workshops);
            formData.append("challenges", reportData.challenges);
            formData.append("recommendations", reportData.recommendations);
            formData.append("document_id", documentId); // Link report to a document

            const response = await axios.post("/reports", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Report Created:", response.data);
            await dispatch("fetchReportsByDocumentId", documentId); // Refresh the list of reports
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message: "Failed to create report. Please try again later.",
                });
            }
            console.error("Failed to create report:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },

    async updateReport({ commit, state, dispatch }, reportData) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const documentId = state.activeDocument.id;

            const formData = new FormData();
            formData.append("municipality", reportData.municipality);
            formData.append("participants", reportData.participants);
            formData.append("workshops", reportData.workshops);
            formData.append("challenges", reportData.challenges);
            formData.append("recommendations", reportData.recommendations);

            await axios.post(`/reports/${reportData.id}/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Report Updated:", reportData);
            await dispatch("fetchReportsByDocumentId", documentId); // Refresh the list of reports
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message: "Failed to update report. Please try again later.",
                });
            }
            console.error("Failed to update report:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },

    async deleteReport({ commit, state, dispatch }, reportId) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            await axios.post(`/reports/${reportId}/delete`);

            if (state.activeDocument) {
                await dispatch("fetchDocumentById", state.activeDocument.id); // Refresh the list of reports
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                commit("SET_ERRORS", error.response.data.errors);
            } else {
                commit("SET_ERRORS", {
                    message: "Failed to delete report. Please try again later.",
                });
            }
            console.error("Failed to delete report:", error);
        } finally {
            dispatch("global/setLoading", false, { root: true }); // Disable global loading
        }
    },
    async fetchRootId({ commit, dispatch }) {
        try {
            dispatch("global/setLoading", true, { root: true }); // Enable global loading
            commit("CLEAR_ERRORS");

            const response = await axios.get("/collections/rootId");
            const rootId = response.data;
            console.log("Root Id fetched", rootId);
            commit("SET_ROOT_ID", rootId);
        } catch (error) {
            console.error("Failed to fetch root id", error);
        } finally {
            dispatch("global/setLoading", false, { root: true });
        }
    },
    setActiveDocument({ commit }, document) {
        commit("SET_ACTIVE_DOCUMENT", document);
    },
    setErrors({ commit }, errors) {
        commit("SET_ERRORS", errors);
    },
};

const getters = {
    activeDocument: (state) => state.activeDocument,
    breadcrumbPath: (state) => {
        let path = [];
        let current = state.activeCollection;

        while (current) {
            path.unshift(current);
            current = current.parent;
        }

        return path;
    },
    activeCollection: (state) => state.activeCollection,
    rootId: (state) => state.rootId,
    errors: (state) => state.errors,
    reports: (state) => state.reports,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
