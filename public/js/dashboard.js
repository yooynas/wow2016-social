/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
(function($) {

  var colors = ['#16a88f','#e60000','#4695fc','#f540d5','#68e9e5'];
  var emotions_hash = {
    anger: "Anger",
    fear: "Fear",
    joy : "Joy",
    sadness : "Sadness",
    disgust : "Disgust"
  }
  var sentiment_hash = {
    positive : "Positive",
    neutral : "Neutral",
    negative : "Negative"
  }

  $.fn.extend({
      initEmotionalToneChart : function(data) {
      // Add the code to build the graph here.

      // End of Add Code...
      },
      initSentimentChart: function(data) {
        var ctx = this.get(0).getContext("2d");
        var labels = [];
        data.keys.forEach(function(s) {
          labels.push(sentiment_hash[s]);
        });
        var items = data.values;
        var bar_chart_data = {
            labels: labels,
            datasets: [{
                label: 'Emotional',
                backgroundColor : '#16a88f',
                fillColor: '#16a88f',
                strokeColor: '#16a88f',
                data: items
            }]
        };

        // This will get the first returned node in the jQuery collection.
        return classification_chart = new Chart(ctx, {
          type: 'bar',
          data: bar_chart_data,
          options: {
              // Elements options apply to all of the options unless overridden in a dataset
              // In this case, we are setting the border of each bar to be 2px wide and green
              elements: {
                  rectangle: {
                      borderWidth: 1,
                      borderColor: '#2C3E50',
                      borderSkipped: 'bottom',
                      backgroundColor: '#2C3E50'
                  }
              },
              responsive: true,
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: 'Overall Social Sentiment',
                  fontColor : '#2C3E50',
                  fontSize: 14
              }
          }
        });

      },
      initEmotionalToneOverTimeChart : function(data) {
        var ctx = this.get(0).getContext("2d");
        var emotions = ['joy', 'anger', 'disgust', 'fear', 'sadness'];

        var datasets = [];
        var labels = data.labels;

        for (var i=0; i<emotions.length; i++) {
          var e = emotions[i];
          if (data[e]) {
            var d = {
              label : emotions_hash[e],
              backgroundColor : colors[i],
              data : data[e].data,
              fill: false,
              pointBorderWidth : 1
            }
            datasets.push(d);
          }
        }
        var config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Social Tone over Time',
                    fontColor : '#2C3E50',
                    fontSize: 14
                },
                tooltips: {
                    mode: 'label'
                },
                hover: {
                    mode: 'dataset'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            show: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            show: true,
                            labelString: 'Value'
                        },
                        ticks: {
                            suggestedMin: 1,
                            suggestedMax: 250,
                        }
                    }]
                }
            }

        };

        return new Chart(ctx, config);
      }
  });
})(jQuery);
