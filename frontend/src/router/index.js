import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/users/LoginPage.vue';
import RegisterPage from '@/views/users/RegisterPage.vue';
import RequestPasswordReset from '@/views/users/RequestPasswordReset.vue';
import ResetPassword from '@/views/users/ResetPassword.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import CollectionPage from '@/views/CollectionPage.vue';
import DocumentPage from '@/views/DocumentPage.vue';
import EventPage from '@/views/EventPage.vue';
import EventDetail from '@/views/EventDetail.vue';
import TagPage from '@/views/TagPage.vue';
import UserDetail from '@/views/UserDetail.vue';
import RolePage from '@/views/RolePage.vue';
import RoleDetail from '@/views/RoleDetail.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import AudiencePage from '@/views/AudiencePage.vue';
import ProjectDetail from '@/views/ProjectDetail.vue';

const routes = [
  {
    path: '/',
    redirect: {name:'Login'}
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/request-password-reset',
    name: 'RequestPasswordReset',
    component: RequestPasswordReset,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    children: [
      {
        path: 'collections/:id', 
        name: 'Collection',
        component: CollectionPage,
        props : true
      },
      {
        path: 'documents/:id', 
        name: 'Document',
        component: DocumentPage,
        props : true
      },
      {
        path: 'events', 
        name: 'Event',
        component: EventPage,
      },
      {
        path: 'projects', 
        name: 'Project',
        component: ProjectPage,
      },
      {
        path: 'audiences', 
        name: 'Audience',
        component: AudiencePage,
      },
      {
        path: 'events/:id', // Dynamic route for event details
        name: 'EventDetail',
        component: EventDetail,
        props: true, // Pass the id as a prop to EventDetail component
      },
      {
        path: 'projects/:id', // Dynamic route for event details
        name: 'ProjectDetail',
        component: ProjectDetail,
        props: true, // Pass the id as a prop to EventDetail component
      },
      {
        path: 'tags', 
        name: 'Tag',
        component: TagPage,
      },
      {
        path: 'users/:id?', // Optional parameter in a nested route
        name: 'UserDetail',
        component: UserDetail,
        props: true, 
      },
      {
        path: 'roles', 
        name: 'Role',
        component: RolePage,
      },
      {
        path: 'roles/:id?', // Optional parameter in a nested route
        name: 'RoleDetail',
        component: RoleDetail,
        props: true, 
      },
      // Add other nested routes here if needed
    ],
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Check if user is authenticated
  const protectedRoutes = ['Dashboard', 'Collection', 'Document', 'Role','Project','Audience','ProjectDetail',
                           'Event', 'EventDetail', 'Tag', 'UserDetail','RoleDetail']; // Routes that require authentication
  
  if (protectedRoutes.includes(to.name) && !token) {
    // If the route requires auth and user is not authenticated, redirect to login
    next({ name: 'Login' });
  } else {
    next(); // Otherwise, proceed to the route
  }
});

export default router;
