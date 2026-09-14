function templateHeartWarning(name, heart, sp) {
  const htmlMsg =
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="margin: 0; padding: 0; color: black;">   
    <div   
      class="content"   
      style="text-align: center; font-family: sans-serif; font-size: 14px; color: black;"   
    >   
      <div>   
        <p style="font-size: 28px; color: #7D7F7F">Cảnh báo quan trọng đến bạn</p>
      </div>
      <div style="text-align: left; margin: 0px 20% 30px 22%;">   
        Thân gửi đến người nhà,
      </div>    
                 
        
      <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
        <p>   
          Chúng tôi nhận thấy tình hình bệnh nhân ` +
    name +
    `
          <br>
           Có các triệu chứng của bệnh tim:
          </br>
        </p>   
        
      </div>   
      <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
        <ul>   
          <li><b>Nhịp tim: ` +
    heart +
    ` bpm</b></li>  
          <li><b>Nồng độ Oxy trong máu: ` +
    sp +
    `%</b></li>  
    </ul>   
      </div>   

      <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
        <p>
          Bạn vui lòng đưa người thân đến gặp bác sĩ sớm nhất để được xử lý kịp thời</br>
          <br>Xin chân thành cảm ơn</br>
          <br><b>Smart healthcare</b></br>
        </p>
      </div> 
  </body>
</html>`;
  return htmlMsg;
}

function templateFallWarning(name, heart, sp) {
  const htmlMsg =
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="margin: 0; padding: 0; color: black;">   
    <div   
      class="content"   
      style="text-align: center; font-family: sans-serif; font-size: 14px; color: black;"   
    >   
      <div>   
        <p style="font-size: 28px; color: #7D7F7F">Cảnh báo quan trọng đến bạn</p>
      </div>
      <div style="text-align: left; margin: 0px 20% 30px 22%;">   
        Thân gửi đến người nhà,
      </div>    
                 
        
      <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
        <p>   
          Chúng tôi nhận thấy bệnh nhân ` +
    name +
    `
          <br>
           có hành động bất thường nghi là bị ngã
          </br>
        </p>   
      </div>   

      <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
        <p>
          Bạn vui lòng kiểm tra hoặc nhờ giúp đỡ nhanh nhất</br>
          <br>Xin chân thành cảm ơn</br>
          <br><b>Smart healthcare</b></br>
        </p>
      </div> 
  </body>
</html>`;
  return htmlMsg;
}

function templateWarning(email, verificationCode) {
  const htmlMsg =
    `<!DOCTYPE html>   
        <html lang="en">   
          <head>   
            <meta charset="UTF-8" />   
            <meta name="viewport content="width=device-width, initial-scale=1.0 />   
            <meta http-equiv="X-UA-Compatible content="ie=edge />   
            <title>Smart Health</title>  
          </head>   
          <body style="margin: 0; padding: 0; color: black;">   
            <div   
              class="content"   
              style="text-align: center; font-family: sans-serif; font-size: 14px; color: black;"   
            >   
              <div>   
                <p style="font-size: 28px; color: #7D7F7F">Cảnh báo quan trọng đến bạn</p>
              </div>
              <div style="text-align: left; margin: 0px 20% 30px 22%;">   
                Thân gửi <span style="color: #0071c5"> ` +
    email +
    `</span>   ,
              </div>  
                          <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
                <p> 
                  <span style="padding-left: 10px; color: #0071c5; font-weight: bold"  >
                   
                    Mã xác nhận của bạn là:
    
                  </span>   
                  <span style="font-size: 16px;"> ` +
    verificationCode +
    `</span>
    
                  <br><span style="padding-left: 10px">Vui lòng nhập mã xác nhận để xác thực tài khoản của bạn. </span></br>
                </p>   
                
              </div> 
              <div   
                style=" height: 100px;   
                        margin: 30px 0;   
                        display: block;   
                        margin: 30px auto;   
                        height: auto;
                      ">
              </div>   
              <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
                <p>   
                  Việc sử dụng nền tảng quản trị điện toán đám mây Mesh sẽ đem lại cho bạn trải nghiệm hoàn toàn mới, đơn giản và thuận tiện hơn bao giờ hết.
                  <br>
                   Các giải pháp chúng tôi đang cung cấp hiện nay:
                  </br>
                </p>   
                
              </div>   
              <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
                <ul>   
                  <li><b>Giải pháp Quản lý nội dung trình chiếu kỹ thuật số</b></li>  
                  <li><b>Giải pháp Quản lý âm thanh đa vùng</b></li>  
                  <li><b>Giải pháp Kiểm soát ra vào</b></li>  
                  <li><b>Giải pháp Nơi làm việc thông minh</b></li>  
                  <li><b>Camera AI</b></li>  
            </ul>   
              </div>   
    
              <div style="margin: 0px 20% 30px 22%;; text-align: left;">   
                <p>
                  Bạn có thể liên hệ qua email: <a target='blank' href="mailto:info@mesh.vn">info@mesh.vn</a>  hoặc hotline: +84933083503 để nhận hỗ trợ nếu có bất cứ khó khăn nào.</br>
                  <br>Xin chân thành cảm ơn,</br>
                  <br><b>Mesh Team</b></br>
                </p>
              </div> 
          </body>
        </html> `;
  return htmlMsg;
}

module.exports = {
  templateWarning: templateWarning,
  templateHeartWarning: templateHeartWarning,
  templateFallWarning: templateFallWarning,
};
