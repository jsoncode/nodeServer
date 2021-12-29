import {spawn} from 'child_process'

export class GitTools {

    /**
     * 构造函数
     * @param {String} cwd 工作目录
     * */
    constructor(cwd) {
        this.cwd = cwd;
    }

    /**
     * git add
     * */
    add() {
        let params = [
            'add',
            '.',
        ];

        return this.startChildProcess('git', params);
    }

    /**
     * git commit
     * @param {String} remark 备注信息
     * */
    commit(remark = 'nodejs run git 默认备注信息') {
        let params = [
            'commit',
            '-m',
            remark
        ];

        return this.startChildProcess('git', params);
    }

    /**
     * git push
     * @param {String} branch 分支名
     * */
    push(branch) {

        if (!branch) {
            throw 'please input branch name !'
        }

        let params = [
            'push',
            'origin',
            branch
        ];

        return this.startChildProcess('git', params);
    }

    /**
     * git checkout
     * @param {String} branch 分支名
     * */
    checkout(branch) {

        if (!branch) {
            throw 'please input branch name !'
        }

        let params = [
            'checkout',
            branch
        ];

        return this.startChildProcess('git', params);
    }

    /**
     * git pull
     * @param {String} branch 分支名
     * */
    pull(branch) {

        if (!branch) {
            throw 'please input branch name !'
        }

        let params = [
            'pull',
            'origin',
            branch
        ];

        return this.startChildProcess('git', params);
    }

    /**
     * git status
     * @return {Boolean} 是否存在修改
     * */
    async status() {

        try {
            let params = [
                'status',
                '-s'
            ];
            let result = await this.startChildProcess('git', params);
            return result ? true : false;
        } catch (err) {
            console.error(err);
        }

        return false;
    }

    /**
     * 开启子进程
     * @param {String} command  命令 (git/node...)
     * @param {Array} params 参数
     * */
    startChildProcess(command, params) {
        return new Promise((resolve, reject) => {
            let process = spawn(command, params, {
                cwd: this.cwd
            });

            let logMessage = `${command} ${params[0]}`;
            let cmdMessage = '';

            process.stdout.on('data', (data) => {
                console.log(`${logMessage} start ---`, data);
                if (!data) {
                    reject(`${logMessage} error1 : ${data}`);
                } else {
                    cmdMessage = data.toString();
                }
            });

            process.on('close', (data, e1, e2, e3) => {
                console.log(`${logMessage} close ---`, data);
                if (data) {
                    reject(`${logMessage} error2 ! ${data}`);
                } else {
                    console.log(`${logMessage} success !`);
                    resolve(cmdMessage);
                }
            });
        })
    }

    /**
     * 自动上传
     * @param {String} remark 备注的信息
     * @param {String} branch 目标分支
     * */
    async autoUpload(remark, branch) {
        try {
            // git checkout branch
            await this.checkout(branch);

            // git pull branch
            await this.pull(branch);

            // git add .
            await this.add();

            // git status -s
            let isChange = await this.status();

            if (isChange) {
                // git commit -m remark
                await this.commit(remark);

                // git push branch
                await this.push(branch);

            } else {
                console.log('not have to upload');
            }

            console.log('auto upload success !');

            return true;
        } catch (err) {
            console.error(err);
        }

        console.log('auto upload error !');
        return false;
    }
}