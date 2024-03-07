import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// Displays input text on a node
app.registerExtension({
	name: "chenran.showcat",
	setup() {
        let executing = false;
        for (const e of ["execution_start", "progress"]) {
			api.addEventListener(e, () => {
				executing = true;
				update();
			});
		}

        console.log("chenran.showcat");
        const catGif = document.createElement("img");

        const gifUrls = [
            "images/cat_1.gif",
            // "images/cat_2.gif",
          ];
      
        //   // 从数组中随机选择一个 GIF 图片的 URL
          const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
      

        // 设置图片源为猫猫 GIF 图片的 URL
        catGif.src = randomGifUrl; // 确保这里的路径指向您的 GIF 图片
        catGif.src = new URL(randomGifUrl, import.meta.url)
        // catGif.src = catGif1;
        // 设置图片样式以定位到页面的左下角
        catGif.style.position = "fixed";
        catGif.style.left = "5px";
        catGif.style.bottom = "5px";
        catGif.style.width = "500px"; // 根据需要调整大小
        catGif.style.height = "auto";
        catGif.style.zIndex = "1000"; // 确保图片在最上层
        catGif.style.display = "none"; // 默认隐藏
        // 将图片元素添加到文档的 body 中
        document.body.appendChild(catGif);

        // 更新 GIF 的显示状态
        const update = () => {
            catGif.style.display = executing ? "block" : "none";
        };
        api.addEventListener("executing", ({ detail }) => {
            // null will be sent when it's finished
            executing = !!detail;
            update();
          });
      
          // 监听 status 事件来更新标题和执行状态
          api.addEventListener("status", ({ detail }) => {
            // let title = "ComfyUI";
            // if (detail && detail.exec_info.queue_remaining) {
            //   title = `(${detail.exec_info.queue_remaining}) ${title}`;
            // }
            // document.title = title;
            update();
            executing = false; // 这里应当仅在确实执行完毕后设置executing为false
          });
      
          // 初始更新，以确保GIF的显示状态与当前执行状态匹配
          update();
	},
});
