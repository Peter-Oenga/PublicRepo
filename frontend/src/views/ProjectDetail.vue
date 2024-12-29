<template>
    <div class="p-6 flex flex-col">
      <!-- Project Overview Section -->
      <div v-if="activeProject" class="bg-white shadow rounded-lg p-6 mb-6">
        <h1 class="text-3xl font-medium mb-4">{{ activeProject.title }}</h1>
        <p class="text-gray-700 mb-4">{{ activeProject.description }}</p>
        <div class="flex space-x-4 mb-6">
          <p><strong>Start Date:</strong> {{ formatDate(activeProject.start_date) }}</p>
          <p><strong>End Date:</strong> {{ formatDate(activeProject.end_date) }}</p>
          <p><strong>Audience:</strong> {{ activeProject.audience?.name || 'N/A' }}</p>
        </div>
        <div class="flex space-x-4 mb-6">
          <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center" @click="editProject">
            <font-awesome-icon icon="edit" class="mr-2" />
            Edit Project
          </button>
          <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center" @click="confirmDeleteProject">
            <font-awesome-icon icon="trash" class="mr-2" />
            Delete Project
          </button>
        </div>
      </div>
  
      <!-- Activities Section -->
      <div  class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Activities</h2>
          <button class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center" @click="createActivity">
            <font-awesome-icon icon="plus" class="mr-2" />
            Add Activity
          </button>
        </div>
        <ul v-if="activeProject && activeProject.activities && activeProject.activities.length">
          <li v-for="activity in activeProject.activities" :key="activity.id" class="flex justify-between items-center p-4 border-b">
            <div>
              <h3 class="font-semibold">{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
              <p><strong>Start:</strong> {{ formatDate(activity.start_date) }} | <strong>End:</strong> {{ formatDate(activity.end_date) }}</p>
              <p><strong>Audience:</strong> {{ activity.audience?.name || 'N/A' }}</p>
              <a :href="formattedReportLink(activity.report)" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline" v-if="activity.report">View Report</a>
            </div>
            <div>
              <button class="text-blue-500 hover:text-blue-700 mr-2" @click="editActivity(activity)">
                <font-awesome-icon icon="pen" />
              </button>
              <button class="text-red-500 hover:text-red-700 mr-2" @click="confirmDeleteActivity(activity)">
                <font-awesome-icon icon="trash" />
              </button>
              <button class="text-green-500 hover:text-red-700" @click="uploadActivityReportFile(activity.id)">
                <font-awesome-icon icon="upload" />
              </button>
            </div>
          </li>
        </ul>
        <div v-else class="no-records py-2">No activities available for this project</div>
      </div>
  
      <!-- Expected Results Section -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Expected Results</h2>
          <button class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center" @click="createExpectedResult">
            <font-awesome-icon icon="plus" class="mr-2" />
            Add Expected Result
          </button>
        </div>
        <ul  v-if="activeProject && activeProject.expected_results && activeProject.expected_results.length">
          <li v-for="result in activeProject.expected_results" :key="result.id" class="flex justify-between items-center p-4 border-b">
            <p>{{ result.description }}</p>
            <div>
              <button class="text-blue-500 hover:text-blue-700 mr-2" @click="editExpectedResult(result)">
                <font-awesome-icon icon="pen" />
              </button>
              <button class="text-red-500 hover:text-red-700" @click="confirmDeleteExpectedResult(result)">
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </li>
        </ul>
        <div v-else class="no-records py-2">No expected results available for this project</div>
      </div>
  
      <!-- Achievements Section -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Achievements</h2>
          <button class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center" @click="createAchievement">
            <font-awesome-icon icon="plus" class="mr-2" />
            Add Achievement
          </button>
        </div>
        <ul v-if="activeProject && activeProject.achievements && activeProject.achievements.length">
          <li v-for="achievement in activeProject.achievements" :key="achievement.id" class="flex justify-between items-center p-4 border-b">
            <div>
              <p>{{ achievement.description }}</p>
              <p><strong>Category:</strong> {{ achievement.category }}</p>
            </div>
            <div>
              <button class="text-blue-500 hover:text-blue-700 mr-2" @click="editAchievement(achievement)">
                <font-awesome-icon icon="pen" />
              </button>
              <button class="text-red-500 hover:text-red-700" @click="confirmDeleteAchievement(achievement)">
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </li>
        </ul>
        <div v-else class="no-records py-2">No achievements available for this project</div>
      </div>
    </div>
    <ActivityCreationModal v-if="showActivityModal" :isVisible="showActivityModal"
     :id="theActivityId" @close="showActivityModal=false;"/>
    <ExpectedResultModal v-if="showExpectedResultModal" :isVisible="showExpectedResultModal"
     :id="theExpectedResultId" @close="showExpectedResultModal=false;"/>
    <AchievementModal v-if="showAchievementModal" :isVisible="showAchievementModal"
     :id="theAchievementId" @close="showAchievementModal=false;"/>
    <UploadActivityReport :isVisible="showReportModal"
     :activityId="theActivityId" @close="showReportModal=false;" />
    <CreateProjectModal v-if="showProjectModal" :isVisible="showProjectModal"
    :id="projectId" @close="showProjectModal=false" />
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import ActivityCreationModal from '@/components/ActivityCreationModal.vue';
  import ExpectedResultModal from '@/components/ExpectedResultModal.vue';
  import AchievementModal from '@/components/AchievementModal.vue';
  import UploadActivityReport from '@/components/UploadActivityReport.vue';
  import CreateProjectModal from '@/components/CreateProjectModal.vue';

  export default {
    data() {
      return {
        showActivityModal: false,
        showExpectedResultModal: false,
        showAchievementModal: false,
        showReportModal: false,
        showProjectModal : false,
        theActivityId: null,
        theExpectedResultId : null,
        theAchievementId : null
      };
    },
    components: {
      ActivityCreationModal,
      ExpectedResultModal,
      AchievementModal,
      UploadActivityReport,
      CreateProjectModal
    },
    computed: {
      ...mapGetters('project', ['activeProject']),
      projectId() {
        return this.$route.params.id;
      }
    },
    async mounted() {
        const projectId = this.$route.params.id;
        console.log('Fetching project Id :',projectId);
        await this.fetchProjectById(projectId);
    },
    methods: {
      ...mapActions('project', ['fetchProjectById', 'deleteProject']),
      ...mapActions('activity', ['deleteActivity']),
      ...mapActions('expectedResult', ['deleteExpectedResult']),
      ...mapActions('achievement', ['deleteAchievement']),
      
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      
      formattedReportLink(report) {
        return report ? `${process.env.VUE_APP_BACKEND_URL}storage/${report}` : '#';
      },
      
      editProject() {
        this.showProjectModal = true;
      },
      
      async confirmDeleteProject() {
        if (confirm('Are you sure you want to delete this project?')) {
          await this.deleteProject(this.$route.params.id);
          this.$router.push({ name: 'Project' });
        }
      },
      createActivity() {
        this.theActivityId = null;
        this.showActivityModal = true;
      },
      editActivity(activity) {
        // Open activity modal with activity details
        this.theActivityId = activity.id;
        this.showActivityModal = true;
      },
      
      async confirmDeleteActivity(activity) {
        if (confirm(`Are you sure you want to delete activity "${activity.title}"?`)) {
          await this.deleteActivity({activityId:activity.id,projectId:this.projectId});
          await this.fetchProjectById(this.$route.params.id); // Refresh project data
        }
      },
      createExpectedResult() {
        this.theExpectedResultId = null;
        this.showExpectedResultModal = true;
      },
      editExpectedResult(result) {
        this.theExpectedResultId = result.id;
        this.showExpectedResultModal = true;
      },
  
      async confirmDeleteExpectedResult(result) {
        if (confirm('Are you sure you want to delete this expected result?')) {
          await this.deleteExpectedResult({expectedResultId:result.id,projectId:this.projectId});
          await this.fetchProjectById(this.projectId);
        }
      },
      createAchievement() {
        this.theAchievementId = null;
        this.showAchievementModal = true;
      },
      editAchievement(achievement) {
        this.theAchievementId = achievement.id;
        this.showAchievementModal = true;
      },
      async confirmDeleteAchievement(achievement) {
        if (confirm('Are you sure you want to delete this achievement?')) {
          await this.deleteAchievement({achievementId:achievement.id,projectId:this.projectId});
          await this.fetchProjectById(this.projectId);
        }
      },
      uploadActivityReportFile(activityId) {
        this.theActivityId=activityId;
        this.showReportModal=true;
      }
    }
  };
  </script>
  
  