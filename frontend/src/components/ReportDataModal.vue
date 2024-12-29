<template>
    <ModalLayout :isVisible="isVisible" @close="close">
        <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ isEditing ? "Edit Report Data" : "Add Report Data" }}
            </h3>
        </template>

        <template #body>
            <form @submit.prevent="submitReportData">
                <!-- Municipality Input -->
                <CustomText
                    v-model="reportData.municipality"
                    prompt="Municipality"
                    :error="
                        errors.municipality ? errors.municipality.join(' ') : ''
                    "
                    required
                />

                <!-- Participants Input -->
                <CustomText
                    v-model="reportData.participants"
                    prompt="Number of Participants"
                    type="number"
                    :error="
                        errors.participants ? errors.participants.join(' ') : ''
                    "
                    required
                />

                <!-- Workshops Input -->
                <CustomText
                    v-model="reportData.workshops"
                    prompt="Number of Workshops"
                    type="number"
                    :error="errors.workshops ? errors.workshops.join(' ') : ''"
                    required
                />

                <!-- Challenges Input (Comma-Separated) -->
                <CustomText
                    v-model="reportData.challenges"
                    prompt="Challenges (comma-separated)"
                    :error="
                        errors.challenges ? errors.challenges.join(' ') : ''
                    "
                />

                <!-- Recommendations Input (Comma-Separated) -->
                <CustomText
                    v-model="reportData.recommendations"
                    prompt="Recommendations (comma-separated)"
                    :error="
                        errors.recommendations
                            ? errors.recommendations.join(' ')
                            : ''
                    "
                />
            </form>
        </template>

        <template #footer>
            <!-- Submit Button -->
            <button
                @click="submitReportData"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
            >
                {{ isEditing ? "Update Report" : "Add Report Data" }}
            </button>
        </template>
    </ModalLayout>
</template>

<script>
import ModalLayout from "./ModalLayout.vue";
import CustomText from "./CustomText.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    components: {
        ModalLayout,
        CustomText,
    },
    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },
        report: {
            type: Object,
            default: () => ({}),
        },
        isEditing: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            reportData: {
                municipality: "",
                participants: 0,
                workshops: 0,
                challenges: "",
                recommendations: "",
            },
        };
    },
    computed: {
        ...mapGetters("collection", ["errors"]),
    },
    methods: {
        ...mapActions("collection", [
            "createReport",
            "updateReport",
            "setErrors",
        ]),

        submitReportData() {
            const payload = {
                municipality: this.reportData.municipality,
                participants: this.reportData.participants,
                workshops: this.reportData.workshops,
                challenges: this.reportData.challenges
                    ? this.reportData.challenges
                          .split(",")
                          .map((item) => item.trim())
                    : [],
                recommendations: this.reportData.recommendations
                    ? this.reportData.recommendations
                          .split(",")
                          .map((item) => item.trim())
                    : [],
            };

            console.log("payload", payload);
            if (this.isEditing) {
                this.updateReport({ id: this.report.id, ...payload });
            } else {
                this.createReport(payload);
            }
        },
        close() {
            const errors = {};
            this.setErrors(errors);
            this.$emit("close");
        },
    },
    watch: {
        report: {
            immediate: true,
            handler(newReport) {
                if (newReport) {
                    this.reportData = {
                        municipality: newReport.municipality || "",
                        participants: newReport.participants || 0,
                        workshops: newReport.workshops || 0,
                        challenges: newReport.challenges || "",
                        recommendations: newReport.recommendations || "",
                    };
                } else {
                    this.reportData = {
                        municipality: "",
                        participants: 0,
                        workshops: 0,
                        challenges: "",
                        recommendations: "",
                    };
                }
            },
        },
    },
};
</script>
