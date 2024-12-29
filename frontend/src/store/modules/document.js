// store/modules/document.js

import axios from '@/axios'; // Use your configured axios instance

const state = {
  // Other state properties...
};

const getters = {
  // Other getters...
};

const actions = {
  async downloadDocument({commit},documentId) {
    console.log(documentId);
    try {
      const response = await axios({
        url: `/documents/${documentId}/download`,
        method: 'GET',
        responseType: 'blob',
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = fileUrl;

      // Map content-types to file extensions
      const contentTypeToExtension = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'text/plain': 'txt',
        'application/zip': 'zip',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      };

      const contentType = response.headers['content-type'];
      const fileExtension = contentTypeToExtension[contentType] || 'txt';
      const fileName = `document.${fileExtension}`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(fileUrl);
      commit('SET_NOTHING','');
    } catch (error) {
      console.error('Error downloading the document:', error);
    }
  },

  async downloadDocumentVersion({commit},{ documentId, versionId }) {
    try {
      const response = await axios({
        url: `/documents/${documentId}/versions/${versionId}/download`,
        method: 'GET',
        responseType: 'blob',
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = fileUrl;

      const contentTypeToExtension = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'text/plain': 'txt',
        'application/zip': 'zip',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      };

      const contentType = response.headers['content-type'];
      const fileExtension = contentTypeToExtension[contentType] || 'txt';
      const fileName = `version-${versionId}.${fileExtension}`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(fileUrl);
      commit('SET_NOTHING','');
    } catch (error) {
      console.error('Error downloading the document version:', error);
    }
  },
  async restoreDocumentVersion({commit},{documentId,versionId}) {
    try {
        commit('global/SET_LOADING',true,{root:true});
        await axios.post(`/documents/${documentId}/restore/${versionId}`);
        commit('SET_NOTHING','');
    }catch(error) {
        console.error('Error restoring the document version',error);
    }finally {
        commit('global/SET_LOADING',false,{root:true});
    }
  }
};

const mutations = {
  // Other mutations...
  SET_NOTHING(state,nothing) {
    console.log(nothing);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
