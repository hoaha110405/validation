function Validator(options) {
    var selectorRules = {}

    //hàm xác thức
    function Validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        //lấy ra các rule của selector
        var rules = selectorRules[rule.selector]

        //Lặp qua các rule và kiểm tra
        //nếu gặp lỗi thì dừng việc kiểm tra và output ra lỗi đầu tiên
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
        //hàm trả về true nếu không có lỗi và false nếu có lỗi
        return !errorMessage
    }

    var formElement = document.querySelector(options.form)
    if(formElement) {

        //khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault()

            var isFormValid = true;

            //lọc qua các rule và valiate
            options.rule.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = Validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            })
            if(isFormValid) {
                if(typeof options.onSubmit === 'function'){
                    var enableInput = document.querySelectorAll(['[name]'])
                    var formValue = Array.from(enableInput).reduce(function(values, input){
                        return (values[input.name] = input.name) && values
                    }, {})
                    options.onSubmit(formValue)
                }
            } else {
                console.log('Co loi')
            }

            
        }

        //Xử lý lặp qua các rule
        options.rule.forEach(function(rule) {

            //Lưu lại các rule khi duyệt qua từng cái
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }   else {
                selectorRules[rule.selector] = [rule.test] //gán 1 mạng có phần từ đầu tiên là rule.test
            }

            var inputElement = formElement.querySelector(rule.selector)

            if(inputElement) {
                inputElement.onblur = function() {
                    Validate(inputElement, rule)
                }

                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                   inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
        // console.log(selectorRules)
    }
}

Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : 'Trường này không được dưới '+min.toString()+' ký tự'
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue) {
    return {
        selector: selector,
        test: function(value) {
            return value == getConfirmValue() ? undefined : 'Mật khẩu không đúng'
        }
    }
}