var questionNum = 0
var questions = []
var remainingResults = data

getQuestion()

function getRatingsList () {
  let results = []
  remainingResults.forEach(x => {
    if (!results.includes(x.content_rating)) {
      results.push(x.content_rating)
    }
  })
  return results
}

function getLengthsList () {
  let results = []
  remainingResults.sort((a, b) => a.duration - b.duration)
  remainingResults.forEach(x => {
    let length = formatLength(x.duration)
    if (!results.includes(length)) {
      results.push(length)
    }
  })
  return results
}

function formatLength (length) {
  length = Math.max(length, 80)
  length = Math.min(length, 170)
  return Math.ceil(length / 30) * 30
}

function formatLanguage (language) {
  if (language === 'English') {
    return language
  }
  return 'Foreign'
}

function formatIMDBScore (score) {
  score = Math.max(5, score)
  score = Math.min(8, score)
  return Math.floor(score)
}

function getDecadesList () {
  let results = []
  remainingResults.sort((a, b) => a.title_year - b.title_year)
  remainingResults.forEach(x => {
    if (!results.includes(Math.floor(x.title_year / 10) * 10)) {
      results.push(Math.floor(x.title_year / 10) * 10)
    }
  })
  return results
}

function getLanguageList () {
  let results = []
  remainingResults.forEach(x => {
    let language = formatLanguage(x.language)
    if (!results.includes(language)) {
      results.push(language)
    }
  })
  return results
}

function getIMDBScoreList () {
  let results = []
  remainingResults.forEach(x => {
    let score = formatIMDBScore(x.imdb_score)
    if (!results.includes(score)) {
      results.push(score)
    }
  })
  return results
}

function getKeywordList () {
  let results = []
  for (var i = 0; i < remainingResults.length; i++) {
    let keywords = remainingResults[i].plot_keywords.split('|')
    keywords.forEach(x => {
      results.push({id: i, keyword: x})
    })
  }
  return results
}

function getGenres () {
  const options = genres
  questions.push({question: questions.length, options: options})
  display(options)
}

function getLengths () {
  const options = getLengthsList()
  const optionNames = options.map(x => {
    switch (x) {
      case 90: return 'Short (<90 mins)'
      case 120: return 'Medium (90min to 2hrs)'
      case 150: return 'Long (2hrs to 2.5hrs)'
      case 180: return 'Very Long (2.5hrs +)'
    }
  })
  questions.push({question: questions.length, options: options, optionsNames: optionNames})
  display(optionNames)
}

function getRatings () {
  const options = getRatingsList()
  questions.push({question: questions.length, options: options})
  display(options)
}

function getDecades () {
  const options = getDecadesList()
  questions.push({question: questions.length, options: options})
  display(options)
}

function getLanguages () {
  const options = getLanguageList()
  questions.push({question: questions.length, options: options})
  display(options)
}

function getScores () {
  const options = getIMDBScoreList()
  const optionNames = options.map(x => {
    switch (x) {
      case 5: return 'Bad (<6)'
      case 6: return 'Okay (6 to 7)'
      case 7: return 'Good (7 to 8)'
      case 8: return 'Excellent (8+)'
    }
  })
  questions.push({question: questions.length, options: options, optionNames: optionNames})
  display(optionNames)
}

function getKeywords () {
  const keywords = getKeywordList()
  const options = keywords.map(x => x.keyword)
  const ids = keywords.map(x => x.id)
  questions.push({question: questions.length, options: options, id: ids})
  display(options)
}

function chooseOption (optionNum) {
  questions[questionNum].answer = optionNum
  if (questionNum === 6) {
    remainingResults = [remainingResults[questions[questionNum].id[optionNum]]]
  } else {
    updateRemaining()
  }
  questionNum ++
  if (isNotLast()) {
    getQuestion()
  }
}

function display (arr) {
  const childDivs = Array.from(document.getElementsByClassName('option'))
  childDivs.forEach(div => {
    div.parentNode.removeChild(div)
  })
  const mainDiv = document.getElementById('maindiv')
  for (let i = 0; i < arr.length; i++) {
    let newDiv = document.createElement('div')
    newDiv.class = 'option'
    newDiv.innerHTML = arr[i]
    newDiv.style.border = 'thick solid #0000FF'
    newDiv.style.background = 'red'
    newDiv.addEventListener('click', () => chooseOption(i))
    mainDiv.appendChild(newDiv)
  }
  let countDiv = document.createElement('div')
  countDiv.class = 'option'
  countDiv.innerHTML = remainingResults.length
  mainDiv.appendChild(countDiv)
}

function getQuestion () {
  switch (questionNum) {
    case 0: getGenres(0); break
    case 1: getRatings(1); break
    case 2: getDecades(2); break
    case 3: getLengths(3); break
    case 4: getLanguages(4); break
    case 5: getScores(5); break
    case 6: getKeywords(6); break;
  }
}

function updateRemaining () {
  remainingResults = remainingResults.filter(getFilter)
}

function getFilter (x, i) {
  switch (questionNum) {
    case 0: return x.genres.split('|').includes(questions[questionNum].options[questions[questionNum].answer])
    case 1: return x.content_rating === questions[questionNum].options[questions[questionNum].answer]
    case 2: return Math.floor(x.title_year / 10) === Math.floor(questions[questionNum].options[questions[questionNum].answer] / 10)
    case 3: return formatLength(x.duration) === questions[questionNum].options[questions[questionNum].answer]
    case 4: return formatLanguage(x.language) === questions[questionNum].options[questions[questionNum].answer]
    case 5: return formatIMDBScore(x.imdb_score) === questions[questionNum].options[questions[questionNum].answer]
  }
}

function isNotLast () {
  if (remainingResults.length === 1) {
    display([remainingResults[0].movie_title])
    return false
  }
  return true
}
