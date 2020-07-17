//try catch finally 구문
//try 시도할 코드 쓰기.
//catch error 발생하면 실행되는 구문
//finally try, catch 후에 반드시 실행되는 구문

//error 발생 형태
// EvalError 전역 함수 eval()에서 발생하는 오류의 인스턴스를 생성합니다.
// InternalError JavaScript 엔진의 내부에서 오류가 발생했음을 나타내는 오류 인스턴스를 생성합니다.
// RangeError 숫자 변수나 매개변수가 유효한 범위를 벗어났음을 나타내는 오류 인스턴스를 생성합니다.
// ReferenceError 잘못된 참조를 했음을 나타내는 오류 인스턴스를 생성합니다.
// SyntaxError eval()이 코드를 분석하는 중 잘못된 구문을 만났음을 나타내는 오류 인스턴스를 생성합니다.
// TypeError 변수나 매개변수가 유효한 자료형이 아님을 나타내는 오류 인스턴스를 생성합니다.
// URIError encodeURI()나 decodeURl() 함수에 부적절한 매개변수를 제공했을 때 발생하는 오류의 인스턴스를 생성합니다.

function calculateTip() {
  var billAmt = document.getElementById("billamt").value;
  var serviceQual = document.getElementById("serviceQual").value;
  var numOfPeople = document.getElementById("peopleamt").value;

  //bill amt와 servicequal은 무조건 들어와야 한다.
  if (billAmt === "" || serviceQual == 0) {
    alert("Please enter values");
    return;//다시 입력하고 실행해야 하므로 return을 통해 function에서 빠져 나와야 한다.
  }
 //숫자가 아닌 문자로 입력했을 때 alert낼 수 있도록 한다., NUMBER()에서 안에 문자가 있다면 오류가 나는 것이 아니라 NAN이 반환된다.
 //전역 NaN 속성은 Not-A-Number(숫자가 아님)
if (isNaN(Number(billAmt)) ||isNaN(Number(serviceQual))){
  alert("insert number please");
  return;
}
// try {
// console.log(1);}
// catch(err) {
//   console.log(2);}
// finally {
//   console.log(3);}
//혼자 OR 다수
  if (numOfPeople === "" || numOfPeople <= 1) {
    numOfPeople = 1;
    document.getElementById("each").style.display = "none";
  } else {
    document.getElementById("each").style.display = "block";
  }
  console.log(12);
  //Calculate tip
  var total = (billAmt * serviceQual) / numOfPeople;
  //round to two decimal places
  total = Math.round(total * 100) / 100;
  //next line allows us to always have two digits after decimal point
  total = total.toFixed(2);
  //Display the tip
  document.getElementById("totalTip").style.display = "block";
  document.getElementById("tip").value = String(total);
  console.log(typeof(total));
  document.getElementById("dtip").submit();
}

//Hide the tip amount on load
document.getElementById("totalTip").style.display = "none";
document.getElementById("each").style.display = "none";

//click to call function
document.getElementById("calculate").onclick = function() {
  calculateTip();
};

//JavaScript는 
//엄격한 비교와 형변환 비교 두 가지의 비교 방법을 모두 가지고 있습니다.
// 엄격(일치) 비교(===)는 두 피연산자가 같은 자료형에, 그 내용도 일치해야만 참입니다.
// 추상(동등) 비교(==)는 비교 전에 두 피연산자를 동일한 자료형으로 변환합니다. 