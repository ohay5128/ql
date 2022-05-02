const axios = require('axios');
const COOKIES = '这里填入你的cookies';

const checkIn = async (cookie) => {
    return axios({
        method: 'post',
        url: 'https://glados.rocks/api/user/checkin',
        headers: {
            'Cookie': cookie,
            'origin': 'https://glados.rocks',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'content-type': 'application/json;charset=UTF-8',
            'content-length': 26
        },
        data: {
            token: "glados_network"
        }
    });
};

const getStatus = async (cookie) => {
    return axios({
        method: 'get',
        url: 'https://glados.rocks/api/user/status',
        headers: {
            'Cookie': cookie
        }
    });
};

const checkInAndGetStatus = async (cookie) => {
    const checkInMessage = (await checkIn(cookie))?.data?.message;

    const userStatus = (await getStatus(cookie))?.data?.data;
    const email = userStatus?.email;
    const leftDays = parseInt(userStatus?.leftDays);

    return {
        '账号': email,
        '天数': leftDays,
        '签到情况': checkInMessage
    };
};

const pushplus = (token, infos) => {
    const titleEmail = infos?.[0]['账号'];
    const titleLeftDays = infos?.[0]['天数'];
    const titleCheckInMessage = infos?.[0]['签到情况'];
    const titleSpace = 4;

    const title = (
        '账号: ' + `${titleEmail}`.padEnd(titleEmail.length + titleSpace) +
        '天数: ' + `${titleLeftDays}`.padEnd(titleLeftDays.toString().length + titleSpace) +
        '签到情况: ' + `${titleCheckInMessage}`
    ).slice(0, 100);

    const data = {
        token,
        title,
        content: JSON.stringify(infos),
        template: 'json'
    };
    console.log(data);

    return axios({
        method: 'post',
        url: `http://www.pushplus.plus/send`,
        data
    });
};


const printLog = (infos) => {
    const contentEmail = infos?.[0]['账号'];
    const contentLeftDays = infos?.[0]['天数'];
    const contentCheckInMessage = infos?.[0]['签到情况'];
    const contentLine = '\n';

    const content = (
        '账号: ' + `${contentEmail}`.padEnd(contentEmail.length) + contentLine +
        '天数: ' + `${contentLeftDays}`.padEnd(contentLeftDays.toString().length) + contentLine +
        '签到情况: ' + `${contentCheckInMessage}`
    ).slice(0, 100);

    return content;
}
const GLaDOSCheckIn = async () => {
    try {
        console.log('GLaDOS，开始签到：')
        // const cookies = process.env.COOKIES?.split('&&') ?? [];
        const cookies = COOKIES.split('&&') ?? [];
        const infos = await Promise.all(cookies.map(async cookie => await checkInAndGetStatus(cookie)));
        console.log(printLog(infos));

        // const PUSHPLUS = process.env.PUSHPLUS;

        // if (PUSHPLUS && infos.length) {
        //     const pushResult = (await pushplus(PUSHPLUS, infos))?.data?.msg;
        //     console.log(pushResult);
        // }
    } catch (error) {
        console.log(error);
    }
};

GLaDOSCheckIn();