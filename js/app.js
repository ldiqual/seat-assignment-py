$(function() {

    var $table = $('#layout-table')
    var $rowsInput = $('#rows-input')
    var $colsInput = $('#cols-input')
    var $employeeForm = $('#employee-form')
    var $employeeTable = $('#employee-table')
    var $tagForm = $('#tag-form')
    var $tagTable = $('#tag-table')

    var layout = []
    var employees = []
    var tags = []
    var employeeTags = {}

    var clearLayout = function() {

        layout = []
        $table.empty()
        var numRows = parseInt($rowsInput.val() || 0)
        var numCols = parseInt($colsInput.val() || 0)

        _.each(_.range(numRows), function(rowIndex) {
            var row = []
            var $tr = $('<tr>')
            _.each(_.range(numCols), function(colIndex) {
                var $td = $('<td>')
                $td.text(colIndex)
                $tr.append($td)
                row.push(false)
            })
            $table.append($tr)
            layout.push(row)
        })
    }

    var updateSelectionUI = function() {
        _.each(layout, function(row, rowIndex) {
            var $tr = $('tr', $table).eq(rowIndex)
            _.each(row, function(isSelected, colIndex) {
                var $td = $('td', $tr).eq(colIndex)
                if (isSelected) {
                    $td.addClass('selected')
                } else {
                    $td.removeClass('selected')
                }
            })
        })
    }

    var updateEmployeeTable = function() {
        $tbody = $('tbody', $employeeTable)
        $tbody.empty()
        _.each(employees, function(employee) {

            var $tr = $('<tr>')
            $tr.data('employee-name', employee)

            var $select = $('<select>')
            $select.append('<option disabled selected value>Select a tag</option>')
            var options = _.map(tags, function(tag) {
                var isSelected = employeeTags[employee] == tag
                return $('<option value="' + tag +'">' + tag + '</option>')
            })
            var currentEmployeeTag = employeeTags[employee]
            $select.val(currentEmployeeTag)
            $select.append(options)

            var $selectTd = $('<td>')
            $selectTd.append($select)
            
            $tr.append('<td>' + employee + '</td>')
            $tr.append($selectTd)
            $tbody.append($tr)
        })
    }

    var updateTagTable = function() {
        $tbody = $('tbody', $tagTable)
        $tbody.empty()
        _.each(tags, function(tag) {
            var $tr = $(
                '<tr>' +
                    '<td>' + tag + '</td>' +
                '</tr>'
            )
            $tbody.append($tr)
        })
    }

    $rowsInput.change(clearLayout)
    $colsInput.change(clearLayout)
    clearLayout()

    $(document).on('click', '#layout-table td', function() {
        var $tr = $(this).parent()
        var col = $(this).index()
        var row = $tr.index()
        layout[row][col] = !layout[row][col]
        updateSelectionUI()
    })

    $(document).on('change', '#employee-table select', function() {
        var $tr = $(this).closest('tr')
        var employeeName = $tr.data('employee-name')
        employeeTags[employeeName] = $(this).val()
        debugger
        console.log(employeeTags)
    })

    $employeeForm.submit(function(ev) {
        ev.preventDefault()
        $nameInput = $('#employee-name-input', this)
        var name = $nameInput.val()

        if (!name) {
            return
        }

        employees.push(name)
        $nameInput.val('')
        updateEmployeeTable()
    })

    $tagForm.submit(function(ev) {
        ev.preventDefault()
        $tagInput = $('#tag-input', this)
        var tag = $tagInput.val()

        if (!tag) {
            return
        }

        tags.push(tag)
        $tagInput.val('')
        updateTagTable()
        updateEmployeeTable()
    })
})