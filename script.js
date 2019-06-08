var colors = ['rgb(250,20,20)', 'rgb(20,20,220)', 'rgb(20,220,20)', 'rgb(20,20,20)', 'rgb(179, 62, 153)', 'rgb(212, 210, 56)', 'rgb(187, 103, 8)'];

function isZero(val) {
    return val == 0 || val == null;
};

function sortNumber(a, b) {
    return a - b;
};

var Player = Vue.component('player', {
    data: function(){
        return {
            'name': '',
            'score': {
                '3': null,
                '4': null,
                '5': null,
                '6': null,
                '7': null,
                '8': null,
                '9': null,
                '10': null,
                'J': null,
                'Q': null,
                'K': null,
            },
        }
    },
    computed: {
        total(){
            let t = 0;
            _.values(this.score).map(function(e){
                t += parseInt(e)||0;
            });
            return t;
        },
        score_as_list() {
            return _.values(this.score).map(function(val,i){
                return val||0;
            });
        },
        num_perfect_rounds(){
            return this.score_as_list.filter(isZero).length;
        },
        cumulative_score(){
            var p = 0;
            return this.score_as_list.map(function(val,i){
                let v_new = val+p;
                p = v_new;
                return v_new;
            })
        },
    },
    watch: {
        cumulative_score(){
            app.updateData()
        }
    }
});


var chart = Vue.component('score-chart', {
    extends: VueChartJs.Line,
    mixins: [VueChartJs.mixins.reactiveProp],
    data() {
        return {
            options: {
                responsive: true,
                height: 400,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: true,
                    labels: {
                        fontSize: 16,

                    }
                }
            }
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    },
});


var app = new Vue({
    el: '#app',
    data: {
        max_players: 7,
        players: [],
        rounds: ['3','4','5','6','7','8','9','10','J','Q','K'],
        datacollection: null,
    },
    computed: {
        leaders(){
            return _.clone(this.players).sort(function(p1,p2){
                return p1.total - p2.total;
            });
        },
    },
    methods: {
        add_player(){
            if(this.players.length < this.max_players){
                this.players.push(new Player);
            }
        },
        updateData(){
            let ds = [];
            this.players.forEach(function(player,index){
                ds.push({
                    label: player.name,
                    data: player.cumulative_score,
                    backgroundColor: null,
                    lineTension: 0,
                    borderColor: colors[index],
                    fill: false,
                })
            });
            this.datacollection = {
                labels: this.rounds,
                datasets: ds
            };
        },
        deletePlayer(player){
            let deletec = window.confirm('Are you sure you want to delete the player?');
            if(deletec){
                let index = this.players.indexOf(player);
                if(index > -1){
                    this.players.splice(index,1);
                };
            }
        }
    },
    mounted(){
        this.add_player();
        this.updateData();
    }
});


window.onbeforeunload = function () {
    return 'Leave site? Changes may not be saved.'
}