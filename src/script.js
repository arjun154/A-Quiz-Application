var correctAns = [] 
var questions = []
var options = [] 

//Api request fucntion
function generateApi(amount, category, difficulty, type){
    var xhr = new XMLHttpRequest()
    xhr.open("GET","https://opentdb.com/api.php?amount="+amount+"&category="+category+"&difficulty="+difficulty+"&type="+type)
    xhr.send()
    xhr.onload = function(){
        quesAns(JSON.parse(this.response),type)
    }
}

//Extract information from api data
function quesAns(obj,type){
    var res = obj.results
    for(var i=0; i<res.length; i++){
        correctAns.push((i+1+" "+res[i].correct_answer).toString())
        questions.push(res[i].question)
        var ans = []
        if(res[i].type == "multiple"){
            for(var j=0; j<res[i].incorrect_answers.length; j++){
                ans.push(res[i].incorrect_answers[j])
            }
            ans.push(res[i].correct_answer)
            options.push(ans)
        }else if(res[i].type == "boolean"){
            ans.push(res[i].correct_answer)
            ans.push(res[i].incorrect_answers[0])
            options.push(ans)
        }
    }
    createElements(type)
}

//question on the page
function createElements(type){
    document.getElementById("options").remove()
    var content = document.getElementById("content")
    for(var i=0; i<questions.length; i++){
        var div = document.createElement('div')
        div.setAttribute("class","div")
        var ques = questions[i].replace(/&quot;/g,'"')
        div.textContent = i+1+"." +" "+ ques
        for(var j=0; j<options[i].length; j++){
            var input = document.createElement("input")
            input.setAttribute("type","radio")
            input.setAttribute("name",i)
            input.setAttribute("value",i+1+" "+options[i][j])
            var label = document.createElement('label')
            label.innerHTML = options[i][j]
            div.append(document.createElement('br'))
            div.append(input)
            div.append(label)
        }
        content.append(div)
        content.append(document.createElement('br'))
    }
    var submit = document.createElement("button")
    submit.textContent = "Submit"
    submit.style.width = "100px"
    submit.style.padding = "10px"
    submit.style.fontSize = "larger"
    submit.style.backgroundColor = "black"
    submit.style.color = "white"
    content.append(submit)
    btnClicked(submit)
}

//submit button is clicked calculate score
function btnClicked(submit){
    submit.addEventListener('click',function(){
        var choosedValues = []
        for(var i=0; i<questions.length; i++){
            var radios = document.getElementsByName(i.toString())
            for(var j=0; j<radios.length; j++){
                if(radios[j].checked){
                    choosedValues.push(radios[j].value)
                }
            }
        }
        var score = 0
        for(var i=0; i<choosedValues.length; i++){
            if(choosedValues[i]==correctAns[i]){
                score+=1
            }
        }
        document.getElementById("content").remove()
        var div = document.createElement("div")
        var h2 = document.createElement("h2")
        h2.textContent = "Your Score is: "+score
        var link = document.createElement("a")
        link.setAttribute('id','link')
        link.setAttribute('href',"/index.html")
        link.innerHTML = "Try Again"
        div.append(h2)
        div.append(document.createElement('br'))
        div.append(link)
        var head = document.getElementById("heading")
        head.appendChild(div)
    })
}

//Button to generate api request
var amount
var btn = document.getElementById("btn")
btn.addEventListener("click", function(){
    amount = document.getElementById("number").value
    var category = document.getElementById("category").value
    var difficulty = document.getElementById("difficulty").value
    var type = document.getElementById("type").value
    generateApi(amount, category, difficulty, type)
})