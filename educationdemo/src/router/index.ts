/*
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-07 13:12:25
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 18:46:38
 * @FilePath: \demo\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from "vue-router";
import {
  House,
  Monitor,
  ChatLineRound,
  Collection,
  UserFilled,
  Opportunity,
  Setting,
  User,
  Lock,
  Menu as Management,
  School,
  OfficeBuilding as Office,
  Reading,
  VideoCameraFilled as VideoCamera,
  Edit,
  Document,
  Connection,
  Platform,
  DataAnalysis,
  VideoPlay,
  Calendar,
  View,
  DocumentChecked,
  TrendCharts,
  Medal,
  Histogram,
  Rank,
  GoldMedal
} from '@element-plus/icons-vue';
import HomeView from "../views/HomeView.vue";
import FileList from "../views/file/List.vue";
import FileDetail from "../views/file/Detail.vue";
import ChatLayout from "../components/ChatLayout.vue";
import Report from "../views/report/List.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/welcome",
      meta: {
        title: '首页',
        icon: House
      }
    },
    {
      path: "/chat",
      name: "chat",
      meta: {
        title: 'AI助手',
        icon: ChatLineRound
      },
      component: () => import("../views/chat/Chat.vue"),
    },
    {
      path: "/mainpage",
      name: "mainpage",
      meta: {
        title: '课程助手',
        icon: UserFilled
      },
      component: () => import("../views/mainpage/mainpage.vue"),
    },
    {
      path: "/report",
      name: "report",
      meta: {
        title: '研报',
        icon: Document
      },
      component: Report,
    },
    // {
    //   path: "/chat-ai",
    //   name: "chat-ai",
    //   component: () => import("../views/chat/Index.vue"),
    //   meta: {
    //     title: 'AI助手',
    //     icon: ChatLineRound,
    //     hidden: true
    //   },
    //   children: [
    //     {
    //       path: "welcome",
    //       name: 'welcome',
    //       component: () => import('../components/chat/WelcomeScreen.vue'),
    //       meta: {
    //         hidden: true
    //       }
    //     },
    //     {
    //       path: "chat",
    //       name: 'chat',
    //       component: () => import('../components/chat/ChatLayout.vue'),
    //       meta: {
    //         hidden: true
    //       }
    //     }
    //   ],
    // },
    {
      path: "/resume",
      name: "resume",
      meta: {
        title: '简历管理',
        icon: Collection
      },
      children: [
        {
          path: "/resumenew",
          name: "resumenew",
          component: () => import("../views/resumenew/resumenew.vue"),
          meta: {
            title: '新版简历'
          }
        },
        // {
        //   path: "/resumeold",
        //   name: "resumeold",
        //   component: () => import("../views/resumeold/resumeold.vue"),
        //   meta: {
        //     title: '旧版简历'
        //   }
        // }
      ]
    },
    {
      path: "/interview",
      name: "interview",
      meta: {
        title: '面试系统',
        icon: UserFilled
      },
      children: [
        {
          path: "/onlineInterview",
          name: "onlineInterview",
          component: () => import("../views/onlineinterview/onlineinterview.vue"),
          meta: {
            title: '在线面试'
          }
        },
        {
          path: "/mockInterview",
          name: "mockInterview",
          component: () => import("../views/mockinterview/mockinterview.vue"),
          meta: {
            title: '模拟面试'
          }
        }
      ]
    },
    {
      path: "/mbti",
      name: "mbti",
      component: () => import("../views/mbti/mbti.vue"),
      meta: {
        title: 'MBTI测试',
        icon: Opportunity
      }
    },
    {
      path: "/management",
      name: "management",
      component: () => import("../views/smart-management/Index.vue"),
      meta: {
        title: '智慧管理',
        icon: Management
      },
      redirect: "/management/smart-class",
      children: [
        {
          path: "/management/smart-class",
          name: "smartClass",
          component: () => import("../views/smart-management/smart-class/Index.vue"),
          meta: {
            title: '智慧排课',
            icon: School
          }
        },
        {
          path: "/management/smart-library",
          name: "smartLibrary",
          component: () => import("../views/smart-management/smart-library/Index.vue"),
          meta: {
            title: '智慧图书馆',
            icon: Reading
          }
        },
        {
          path: "/management/smart-office",
          name: "smartOffice",
          component: () => import("../views/smart-management/smart-office/Index.vue"),
          meta: {
            title: '智慧办公',
            icon: Office
          }
        },
        {
          path: "/management/smart-security",
          name: "smartSecurity",
          component: () => import("../views/smart-management/smart-security/Index.vue"),
          meta: {
            title: '智慧安防',
            icon: VideoCamera
          }
        }
      ]
    },
    {
      path: "/smart-education",
      name: "smartEducation",
      component: () => import("../views/smart-education/Index.vue"),
      meta: {
        title: '智能备课',
        icon: School
      },
      redirect: "/smart-education/teacher-ai-assistant",
      children: [
        {
          path: "/smart-education/teacher-ai-assistant",
          name: "teacherAiAssistant",
          component: () => import("../views/smart-education/teacher-ai-assistant/Index.vue"),
          meta: {
            title: '教师AI助手',
            icon: Edit
          }
        },
        {
          path: "/smart-education/research-platform",
          name: "researchPlatform",
          component: () => import("../views/smart-education/research-platform/Index.vue"),
          meta: {
            title: '智能教研协作平台',
            icon: Connection
          }
        },
        {
          path: "/smart-education/teaching-resource",
          name: "teachingResource",
          component: () => import("../views/smart-education/teaching-resource/Index.vue"),
          meta: {
            title: '智能化教学资源生成',
            icon: Platform
          }
        },
        {
          path: "/smart-education/smart-homeworkNew",
          name: "smartHomeworkNew",
          component: () => import("@/views/smart-education/smart-homeworkNew/Index.vue"),
          meta: {
            title: '智能题库与作业设计',
            icon: Document
          }
        },
      ]
    },
    {
      path: "/ai-teaching",
      name: "aiTeaching",
      component: () => import("../views/ai-teaching/Index.vue"),
      meta: {
        title: 'AI教学',
        icon: School
      },
      redirect: "/ai-teaching/ai-classroom",
      children: [
        {
          path: "/ai-teaching/ai-classroom",
          name: "aiClassroom",
          component: () => import("../views/ai-teaching/ai-classroom/Index.vue"),
          meta: {
            title: 'AI课堂',
            icon: Monitor
          }
        },
        {
          path: "/ai-teaching/ai-live",
          name: "aiLive",
          component: () => import("../views/ai-teaching/ai-live/Index.vue"),
          meta: {
            title: 'AI直播',
            icon: VideoPlay
          }
        },
        {
          path: "/ai-teaching/classroom-analysis",
          name: "classroomAnalysis",
          component: () => import("../views/ai-teaching/classroom-analysis/Index.vue"),
          meta: {
            title: '课堂数据分析',
            icon: DataAnalysis
          }
        },
        {
          path: "/ai-teaching/smart-blackboard",
          name: "smartBlackboard",
          component: () => import("../views/ai-teaching/smart-blackboard/Index.vue"),
          meta: {
            title: '智慧黑板',
            icon: DataAnalysis
          }
        }
      ]
    },
    {
      path: "/smart-learning",
      name: "smartLearning",
      component: () => import("../views/smart-learning/Index.vue"),
      meta: {
        title: '智慧学习',
        icon: Reading
      },
      redirect: "/smart-learning/homework",
      children: [
        {
          path: "/smart-learning/homework",
          name: "smartHomework",
          component: () => import("../views/smart-learning/homework/Index.vue"),
          meta: {
            title: '智慧作业',
            icon: Document
          }
        },
        {
          path: "/smart-learning/english",
          name: "smartEnglish",
          component: () => import("../views/smart-learning/english/Index.vue"),
          meta: {
            title: '智能英语听说',
            icon: ChatLineRound
          }
        },
        {
          path: "/smart-learning/sports",
          name: "smartSports",
          component: () => import("../views/smart-learning/sports/Index.vue"),
          meta: {
            title: '智慧体育',
            icon: Platform
          }
        },
        {
          path: "/smart-learning/calligraphy",
          name: "aiCalligraphy",
          component: () => import("../views/smart-learning/calligraphy/Index.vue"),
          meta: {
            title: 'AI练字',
            icon: Edit
          }
        }
      ]
    },
    {
      path: "/smart-exam",
      name: "smartExam",
      component: () => import("../views/smart-exam/Index.vue"),
      meta: {
        title: '智能考试',
        icon: Document
      },
      redirect: "/smart-exam/exam-schedule",
      children: [
        {
          path: "/smart-exam/exam-schedule",
          name: "examSchedule",
          component: () => import("../views/smart-exam/exam-schedule/Index.vue"),
          meta: {
            title: '智能排考',
            icon: Calendar
          }
        },
        {
          path: "/smart-exam/exam-marking",
          name: "examMarking",
          component: () => import("../views/smart-exam/exam-marking/Index.vue"),
          meta: {
            title: '智慧阅卷',
            icon: DocumentChecked
          }
        },
        {
          path: "/smart-exam/exam-monitoring",
          name: "examMonitoring",
          component: () => import("../views/smart-exam/exam-monitoring/Index.vue"),
          meta: {
            title: '智能监考',
            icon: View
          }
        },
        {
          path: "/smart-exam/exam-analysis",
          name: "examAnalysis",
          component: () => import("../views/smart-exam/exam-analysis/Index.vue"),
          meta: {
            title: '智能考试数据分析与预测',
            icon: TrendCharts
          }
        }
      ]
    },
    {
      path: "/smart-evaluation",
      name: "smartEvaluation",
      component: () => import("../views/smart-evaluation/Index.vue"),
      meta: {
        title: '智能评测',
        icon: DataAnalysis
      },
      redirect: "/smart-evaluation/mental-health",
      children: [
        {
          path: "/smart-evaluation/mental-health",
          name: "mentalHealth",
          component: () => import("../views/smart-evaluation/mental-health/Index.vue"),
          meta: {
            title: '智慧心理健康',
            icon: Medal
          }
        },
        {
          path: "/smart-evaluation/teaching-evaluation",
          name: "teachingEvaluation",
          component: () => import("../views/smart-evaluation/teaching-evaluation/Index.vue"),
          meta: {
            title: '教学评测',
            icon: Histogram
          }
        },
        {
          path: "/smart-evaluation/teacher-evaluation",
          name: "teacherEvaluation",
          component: () => import("../views/smart-evaluation/teacher-evaluation/Index.vue"),
          meta: {
            title: '教师评价',
            icon: Rank
          }
        },
        {
          path: "/smart-evaluation/student-evaluation",
          name: "studentEvaluation",
          component: () => import("../views/smart-evaluation/student-evaluation/Index.vue"),
          meta: {
            title: '学生综合素质评价',
            icon: GoldMedal
          }
        }
      ]
    },
    // {
    //   path: "/system",
    //   name: "system",
    //   meta: {
    //     title: '系统管理',
    //     icon: Setting
    //   },
    //   children: [
    //     {
    //       path: "user",
    //       name: "user",
    //       component: () => import("../views/system/user/index.vue"),
    //       meta: {
    //         title: '用户管理',
    //         icon: User
    //       }
    //     },
    //     {
    //       path: "role",
    //       name: "role",
    //       component: () => import("../views/system/role/index.vue"),
    //       meta: {
    //         title: '角色管理',
    //         icon: Lock
    //       }
    //     }
    //   ]
    // },

    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
    // {
    //   path: "/test",
    //   name: "test",
    //   component: () => import("../components/markdown/index.vue"),
    // },
    // {
    //   path: "/file",
    //   name: "file",
    //   component: () => import("../views/file/List.vue"),
    // },
    // {
    //   path: "/file/:id",
    //   name: "fileDetail",
    //   component: () => import("../views/file/Detail.vue"),
    // },
    // {
    //   path: "/welcome",
    //   name: "welcome",
    //   component: () => import("../views/welcome/WelcomeScreen.vue"),
    // },
    // {
    //   path: "/mainpage",
    //   name: "mainpage",
    //   component: () => import("../views/mainpage/mainpage.vue"),
    // },
    // {
    //   path: "/report",
    //   name: "report",
    //   component: Report,
    // },
    // {
    //   path: "/report/:id",
    //   name: "reportDetail",
    //   component: () => import("../views/report/Detail.vue"),
    // },
  ],
});

export default router;
