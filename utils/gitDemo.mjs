import {GitTools} from "./gitTools.mjs";

// 下述修改为你的本地git仓库目录
let git = new GitTools(`C:/chris-workspace/gitpage`);

// 自动化上传
// await git.autoUpload('自动化上传','dev');

// 切换分支
// await git.checkout('dev');

// 拉取代码
// await git.pull('dev');

// 暂存
// await git.add();

// 提交
// await git.commit('测试');

// 推送
// await git.push('dev');

// 是否存在修改
let result = await git.status();
console.log(result)