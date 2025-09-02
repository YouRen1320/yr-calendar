// components/yr-calendar/yr-calendar.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        isMonthView: false, //是否显示本月视图
        currentYear: 2025, //当前年份
        currentMonth: 8, //当前月份
        weekDays: [], //当前周
        monthDays: [] //当前月
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 显示本月
        showMonth() {
            this.setData({
                isMonthView: !this.data.isMonthView,
            })
            // if (this.data.isMonthView) {
            //     //显示本月视图
            //     this.calculateMonthDays();
            // } else {
            //     // 显示本周视图
            //     this.calculateWeekDays();
            // }
        }
    }
})