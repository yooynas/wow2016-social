/*
 * IBM Confidential
 * OCO Source Materials
 * (C) Copyright IBM Corp. 2015, 2016
 * The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
 */
(function($) {

  $.fn.extend({
      initDataTable: function(data) {
        var $table = $('#data-table').bootstrapTable({
          url: '/api/socialdata',
          pagination : true,
          sidePagination: 'server',
          columns: [{
                field: 'text',
                title: 'Text'
            }, {
                field: 'source_id',
                title: 'From'
            }, {
                field: 'created_at',
                title: 'When'
            },{
                field: 'source_system',
                title: 'Source'
            },{
                field: 'sentiment.type',
                title: 'Sentiment'
            },{
                field: '_id',
                title: 'Delete',
                formatter: deleteIncomingFormatter
            }]
        });

        $table.on('load-success.bs.table', function(e) {
          $('a.delete-link').on('click', function(e) {
            console.log('in delete-link');
            var delete_link = $(e.target);
            var _id = delete_link.data('id');
            var _rev = delete_link.data('rev');
            var params = '?_id=' + _id + '&_rev=' + _rev;
            $.ajax({
                url: '/api/incoming' + params,
                type: 'DELETE'
            }).done(function() {
              $('#data-table').bootstrapTable('refresh');
            }).fail(function(jqXHR, status, err) {
              console.log(err);
            });
          });
        });
      }
  });

  function deleteIncomingFormatter(value, row) {
    return '<a class="delete-link" href=\"#\" data-id=\"' + value + '\" data-rev=\"' + row._rev + '\">Delete</a>'
  }

})(jQuery);
