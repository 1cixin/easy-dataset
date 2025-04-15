import {createProject, getProjectModelConfig, getProjects, isExistByName} from "@/lib/db/projects";
import {getQuestionsCount} from "@/lib/db/questions";
import {getDatasetsCount} from "@/lib/db/datasets";

export async function POST(request) {
    try {
        const projectData = await request.json();
        // 验证必要的字段
        if (!projectData.name) {
            return Response.json({error: '项目名称不能为空'}, {status: 400});
        }

        // 验证项目名称是否已存在
        if (await isExistByName(projectData.name)) {
            return Response.json({error: '项目名称已存在'}, {status: 400});
        }

        // 如果指定了要复用的项目配置
        if (projectData.reuseConfigFrom) {
            projectData.modelConfig = await getProjectModelConfig(projectData.reuseConfigFrom);
        }

        // 创建项目
        const newProject = await createProject(projectData);
        return Response.json(newProject, {status: 201});
    } catch (error) {
        console.error('创建项目出错:', error);
        return Response.json({error: error.message}, {status: 500});
    }
}

export async function GET(request) {
    try {
        // 获取所有项目
        const userProjects = await getProjects();
        // 为每个项目添加问题数量和数据集数量
        const projectsWithStats = await Promise.all(
            userProjects.map(async project => {
                // 获取问题数量
                const questionsCount = await getQuestionsCount(project.id);

                // 获取数据集数量
                const datasetsCount = await getDatasetsCount(project.id)

                // 添加最后更新时间
                const lastUpdated = new Date().toLocaleDateString('zh-CN');

                return {
                    ...project,
                    questionsCount,
                    datasetsCount,
                    lastUpdated
                };
            })
        );

        return Response.json(projectsWithStats);
    } catch (error) {
        console.error('获取项目列表出错:', error);
        return Response.json({error: error.message}, {status: 500});
    }
}
