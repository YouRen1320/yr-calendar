Component({
    properties: {},
    data: {
        isMonthView: false,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        selectedDate: new Date().getDate(),
        nowWeekDays: [],
        monthWeeks: []
    },

    lifetimes: {
        ready() {
            this.initData();
        }
    },
    methods: {
        showMonth() {
            this.setData({
                isMonthView: !this.data.isMonthView
            });
        },

        // 初始化数据
        initData() {
            this.generateWeekData();
            this.generateMonthData();
        },

        // 生成周视图数据
        generateWeekData() {
            const {
                year,
                month,
                selectedDate
            } = this.data;
            const today = new Date();
            const currentDate = new Date(year, month - 1, selectedDate);
            const weekStart = new Date(currentDate);
            weekStart.setDate(selectedDate - currentDate.getDay());

            const nowWeekDays = [];
            const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];

            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const day = date.getDate();

                nowWeekDays.push({
                    date: day,
                    weekLabel: weekLabels[i],
                    isToday: this.isToday(date, today),
                    isSelected: day === selectedDate && date.getMonth() === month - 1
                });
            }

            this.setData({
                nowWeekDays
            });
        },

        // 生成月视图数据
        generateMonthData() {
            const {
                year,
                month,
                selectedDate
            } = this.data;
            const today = new Date();
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(1 - firstDay.getDay()); // 周日开始

            const monthWeeks = [];
            const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];

            for (let week = 0; week < 6; week++) {
                const weekDays = [];
                for (let day = 0; day < 7; day++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + week * 7 + day);
                    const dayNum = currentDate.getDate();
                    const isCurrentMonth = currentDate.getMonth() === month - 1;

                    weekDays.push({
                        date: dayNum,
                        weekLabel: weekLabels[day],
                        isCurrentMonth,
                        isToday: this.isToday(currentDate, today),
                        isSelected: isCurrentMonth && dayNum === selectedDate
                    });
                }
                monthWeeks.push(weekDays);

                // 如果这一周都是下个月的日期，停止生成
                if (weekDays.every(d => !d.isCurrentMonth && d.date < 15)) break;
            }

            this.setData({
                monthWeeks
            });
        },

        // 判断是否是今天
        isToday(date, today) {
            return date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();
        },

        // 点击周视图日期
        onWeekDateTap(e) {
            const date = parseInt(e.currentTarget.dataset.date);

            // 只更新选中状态，不改变周的日期范围
            const updatedWeekDays = [];
            for (let i = 0; i < this.data.nowWeekDays.length; i++) {
                const item = this.data.nowWeekDays[i];
                updatedWeekDays.push({
                    date: item.date,
                    weekLabel: item.weekLabel,
                    isToday: item.isToday,
                    isSelected: item.date === date
                });
            }

            this.setData({
                selectedDate: date,
                nowWeekDays: updatedWeekDays
            });
        },

        // 点击月视图日期
        onMonthDateTap(e) {
            const {
                weekIndex,
                dayIndex
            } = e.currentTarget.dataset;
            const clickedDay = this.data.monthWeeks[weekIndex][dayIndex];

            if (!clickedDay.isCurrentMonth) return;

            this.setData({
                selectedDate: clickedDay.date
            });
            this.generateMonthData();
        }
    },
});