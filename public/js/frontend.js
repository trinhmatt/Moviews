function ratingsSort() {
  var sorting = true,
      dir = 'dsc',
      count = 0,
      ratings = document.getElementsByClassName('list-rating')

  while (sorting) {
    var allRows = document.getElementsByTagName('tr');
    sorting = false

    //Need to have i start at 1 so you can sort more than once
    for (i=1; i<allRows.length-1; i++) {
      var shouldSwitch = false,
      singleRow1 = allRows[i],
      singleRow2 = allRows[i+1],
      singleRowRating1 = parseInt(ratings[i-1].textContent),
      singleRowRating2 = parseInt(ratings[i].textContent)

      if (dir === 'dsc') {
        if (singleRowRating1 < singleRowRating2) {
          shouldSwitch = true
          break;
        }
      } else if (dir === 'asc') {
        if (singleRowRating1 > singleRowRating2) {
          shouldSwitch = true
          break;
        }
      }
    }
    if (shouldSwitch) {
      allRows[i].parentNode.insertBefore(allRows[i + 1], allRows[i])
      sorting = true
      count ++
    } else if (dir === 'dsc' && count === 0) {
      sorting = true
      dir = 'asc'
    }
  }
}

function titleSort() {
  var sorting = true,
      dir = 'dsc',
      count = 0,
      titles = document.getElementsByClassName('list-title')

  while (sorting) {
    var allRows = document.getElementsByTagName('tr');
    sorting = false

    //Need to have i start at 1 so you can sort more than once
    for (i=1; i<allRows.length-1; i++) {
      var shouldSwitch = false,
      singleRow1 = allRows[i],
      singleRow2 = allRows[i+1],
      singleRowTitle1 = titles[i-1].textContent.toLowerCase(),
      singleRowTitle2 = titles[i].textContent.toLowerCase()

      if (dir === 'dsc') {
        if (singleRowTitle1 < singleRowTitle2) {
          shouldSwitch = true
          break;
        }
      } else if (dir === 'asc') {
        if (singleRowTitle1 > singleRowTitle2) {
          shouldSwitch = true
          break;
        }
      }
    }
    if (shouldSwitch) {
      allRows[i].parentNode.insertBefore(allRows[i + 1], allRows[i])
      sorting = true
      count ++
    } else if (dir === 'dsc' && count === 0) {
      sorting = true
      dir = 'asc'
    }
  }
}
