/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
(function($) {

  $.fn.extend({
      initClassificationChart: function(data) {
        var ctx = this.get(0).getContext("2d");
        var labels = [];
        var items = [];
        $.each(data, function(idx, item) {
          labels.push(item.key);
          items.push(item.value);
        });
        var bar_chart_data = {
            labels: labels,
            datasets: [{
                label: 'Classifications',
                backgroundColor : '#2C3E50',
                fillColor: '#2C3E50',
                strokeColor: '#2C3E50',
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
                  text: 'Classification of Social Data',
                  fontColor : '#2C3E50',
                  fontSize: 14
              }
          }
        });

      },
      initEmotionalToneChart : function(data) {
        var ctx = this.get(0).getContext("2d");
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#2C3E50',
                        '#3498DB'
                    ]
                }],
                labels: data.keys
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Allocated To Watson',
                    fontColor : '#708090',
                    fontSize: 14
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        }
        return new Chart(ctx, config);
      }
  });
})(jQuery);
