// components/yr-calendar/yr-calendar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        isMonthView: false, //是否显示本月视图
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        weeksArr: ["日", "一", "二", "三", "四", "五", "六"],
        nowMonth: new Date().getMonth() + 1, //本月是几月
        nowDay: new Date().getDate(), //本月当天的日期
        selectedDate: new Date().getDate(), //当前选中的日期
        lastMonthDays: [], //上一个月
        nowMonthDays: [], //本月
        nextMonthDays: [], //下一个月
        nowWeekDays: [], //本周
        monthWeeks: [],
    },

    lifetimes: {
        //  组件显示的时候执行
        ready() {
            let {
                year,
                month
            } = this.data;
            this.createDays(year, month);
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 显示本月
        showMonth() {
            this.setData({
                isMonthView: !this.data.isMonthView,
            });
        },

        // 获取上个月日期
        getLastMonthDays(year, month) {
            let nowMonthFirstDays = new Date(year, month - 1, 1).getDay();
            let lastMonthDays = [];
            if (nowMonthFirstDays) {
                //判断当月的第一天是不是星期天
                //上个月显示多少天
                let lastMonthNums =
                    month - 1 < 0 ?
                    this.getThisMonthDays(year - 1, 12) :
                    this.getThisMonthDays(year, month - 1); //判断是否会跨年
                //上个月从几号开始显示
                for (
                    let i = lastMonthNums - nowMonthFirstDays + 1; i <= lastMonthNums; i++
                ) {
                    let time = new Date(year, month - 2, i).toLocaleDateString(); //对应的时间
                    lastMonthDays.push({
                        date: i, //几号
                        week: this.data.weeksArr[new Date(year, month - 2, i).getDay()], //星期几
                        time,
                        isNowMonthDay: "",
                    });
                }
            }
            this.setData({
                lastMonthDays,
            });
            console.log("上个月日期:");
            console.log(lastMonthDays);
        },

        // 获取当月日期
        getNowMonthDays(year, month) {
            let {
                nowMonth,
                nowDay
            } = this.data;
            let nowMonthDays = [];
            let days = this.getThisMonthDays(year, month); //获取当月的天数
            for (let i = 1; i <= days; i++) {
                let d = new Date(year, month - 1, i);
                let years = d.getFullYear();
                let months = d.getMonth() + 1;
                let day = d.getDate();
                let time = `${years + "/" + months + "/" + day}`; // 2023/3/3
                nowMonthDays.push({
                    date: i, //几号
                    week: this.data.weeksArr[new Date(year, month - 1, i).getDay()], //星期几
                    time,
                    color: false, //为已打卡日期样式做准备
                    day, //后面会改成农历
                    isNowMonthDay: month == nowMonth && i == nowDay ? "isNowMonthDay" : "",
                });
            }
            this.setData({
                nowMonthDays,
            });
            console.log("当月日期:");
            console.log(nowMonthDays);
        },

        // 获取下个月日期
        getNextMonthDays(year, month) {
            let {
                lastMonthDays,
                nowMonthDays
            } = this.data;
            let nextMonthDays = [];
            let nextMonthNums =
                lastMonthDays.length + nowMonthDays.length > 35 ?
                42 - (lastMonthDays.length + nowMonthDays.length) :
                35 - (lastMonthDays.length + nowMonthDays.length); //下个月显示多少天
            let nowYear = parseInt(month) + 1 > 12 ? year + 1 : year; //下一个月的年份
            let nowMonth = parseInt(month) + 1 > 12 ? 1 : parseInt(month) + 1; //下一个月的月份
            if (nextMonthNums) {
                //判断当前天数是否大于零
                for (let i = 1; i <= nextMonthNums; i++) {
                    let time = new Date(year, month - 1, i).toLocaleDateString();
                    nextMonthDays.push({
                        date: i, //几号
                        week: this.data.weeksArr[
                            new Date(nowYear, nowMonth - 1, i).getDay()
                        ], //星期几
                        time,
                        isNowMonthDay: "",
                    });
                }
            }
            this.setData({
                nextMonthDays,
            });
            console.log("下个月日期:");
            console.log(nextMonthDays);
        },

        // 获取当月天数
        getThisMonthDays(year, month) {
            return new Date(year, month, 0).getDate();
        },

        // 生成月视图日期
        generateMonthWeeks() {
            const {
                lastMonthDays,
                nowMonthDays,
                nextMonthDays,
                selectedDate
            } =
            this.data;

            // 合并所有日期数据 - 不使用扩展运算符
            const allDays = [];

            // 添加上个月日期
            for (let i = 0; i < lastMonthDays.length; i++) {
                const item = lastMonthDays[i];
                allDays.push({
                    date: item.date,
                    week: item.week,
                    time: item.time,
                    isNowMonthDay: item.isNowMonthDay,
                    isCurrentMonth: false,
                });
            }

            // 添加本月日期
            for (let i = 0; i < nowMonthDays.length; i++) {
                const item = nowMonthDays[i];
                allDays.push({
                    date: item.date,
                    week: item.week,
                    time: item.time,
                    color: item.color,
                    day: item.day,
                    isNowMonthDay: item.isNowMonthDay,
                    isCurrentMonth: true,
                });
            }

            // 添加下个月日期
            for (let i = 0; i < nextMonthDays.length; i++) {
                const item = nextMonthDays[i];
                allDays.push({
                    date: item.date,
                    week: item.week,
                    time: item.time,
                    isNowMonthDay: item.isNowMonthDay,
                    isCurrentMonth: false,
                });
            }

            // 添加选中状态、今天标识和星期标签
            const daysWithSelection = [];
            const today = new Date();
            const {
                year,
                month,
                nowDay
            } = this.data;

            for (let i = 0; i < allDays.length; i++) {
                const item = allDays[i];

                // 判断是否是今天（只有当月且日期匹配才是今天）
                const isToday = item.isCurrentMonth &&
                    year === today.getFullYear() &&
                    month === (today.getMonth() + 1) &&
                    item.date === nowDay;

                daysWithSelection.push({
                    date: item.date,
                    week: item.week,
                    time: item.time,
                    color: item.color,
                    day: item.day,
                    isNowMonthDay: item.isNowMonthDay,
                    isCurrentMonth: item.isCurrentMonth,
                    isSelected: item.isCurrentMonth && item.date === selectedDate,
                    isToday: isToday,
                    weekLabel: this.data.weeksArr[i % 7],
                });
            }

            // 按周分组（每7天一组）
            const monthWeeks = [];
            for (let i = 0; i < daysWithSelection.length; i += 7) {
                monthWeeks.push(daysWithSelection.slice(i, i + 7));
            }

            this.setData({
                monthWeeks: monthWeeks,
            });
        },

        // 获取本周日期
        getNowWeekDays() {
            const {
                year,
                month,
                nowDay,
                selectedDate
            } = this.data;
            const currentDate = new Date(year, month - 1, selectedDate); // 选中的日期
            const currentDay = currentDate.getDay(); // 获取是星期几 (0=周日, 1=周一...)

            // 计算本周的开始日期（周日）
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(selectedDate - currentDay);

            const nowWeekDays = [];

            // 生成本周7天的数据
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStartDate);
                date.setDate(weekStartDate.getDate() + i);

                const day = date.getDate();
                const isToday =
                    date.getFullYear() === new Date().getFullYear() &&
                    date.getMonth() === new Date().getMonth() &&
                    day === nowDay;
                const isSelected =
                    day === selectedDate && date.getMonth() === month - 1;

                nowWeekDays.push({
                    date: day,
                    weekLabel: this.data.weeksArr[i],
                    isToday: isToday,
                    isSelected: isSelected,
                    fullDate: date,
                });
            }

            this.setData({
                nowWeekDays,
            });

            console.log("本周日期:", nowWeekDays);
        },

        //创建日期——总方法
        createDays(year, month) {
            this.getLastMonthDays(year, month);
            this.getNowMonthDays(year, month);
            this.getNextMonthDays(year, month);
            this.getNowWeekDays();
            this.generateMonthWeeks();
        },

        // 点击周视图日期
        onWeekDateTap(e) {
            const {
                date
            } = e.currentTarget.dataset;
            const updatedWeekDays = [];
            for (let i = 0; i < this.data.nowWeekDays.length; i++) {
                const item = this.data.nowWeekDays[i];
                updatedWeekDays.push({
                    date: item.date,
                    weekLabel: item.weekLabel,
                    isToday: item.isToday,
                    fullDate: item.fullDate,
                    isSelected: item.date === date,
                });
            }

            this.setData({
                selectedDate: date,
                nowWeekDays: updatedWeekDays,
            });
        },

        // 点击月视图日期
        onMonthDateTap(e) {
            const { weekIndex, dayIndex } = e.currentTarget.dataset;
            const wIndex = parseInt(weekIndex);
            const dIndex = parseInt(dayIndex);
            const clickedDay = this.data.monthWeeks[wIndex][dIndex];
            
            // 如果点击的不是本月日期，直接返回，不做任何操作
            if (!clickedDay.isCurrentMonth) {
                return;
            }

            // 使用下标精确更新选中状态，避免重复日期问题
            const updatedMonthWeeks = [];
            for (let i = 0; i < this.data.monthWeeks.length; i++) {
                const week = this.data.monthWeeks[i];
                const updatedWeek = [];
                for (let j = 0; j < week.length; j++) {
                    const day = week[j];
                    updatedWeek.push({
                        date: day.date,
                        week: day.week,
                        time: day.time,
                        color: day.color,
                        day: day.day,
                        isNowMonthDay: day.isNowMonthDay,
                        isCurrentMonth: day.isCurrentMonth,
                        isToday: day.isToday, // 保持今天的标识不变
                        weekLabel: day.weekLabel,
                        isSelected: i === wIndex && j === dIndex, // 使用下标精确匹配
                    });
                }
                updatedMonthWeeks.push(updatedWeek);
            }

            this.setData({
                selectedDate: clickedDay.date,
                monthWeeks: updatedMonthWeeks,
            });
        },
    },
});