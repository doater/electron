# node构建桌面应用 #
## 简介 ##
用electron构建桌面应用,与gulp搭配,将打包工具可视化,模仿weflow,自主开发。
## 使用 ##
项目目录
	
	/
    |——demo/
		|——app/
    		|——statics/
				|——source
					|——_tasks gulpjs打包脚本(可继续优化)
			|——index.html 主窗口
			|——index.js 主窗口的渲染进程
			|——list.html 子窗口
			|——list.js 子窗口的渲染进程
			|——util.js 工具类模块
		|——main.js 主程序入口

1. 安装项目依赖`npm install`
2. 运行项目`npm start`
