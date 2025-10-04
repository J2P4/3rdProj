<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--
    파일명: name_phone_table.jsp
    목적  : JSP로 "이름, 전화번호"를 입력하는 테이블을 만들고,
            (1) 브라우저 콘솔(F12)로 즉시 로그 출력
            (2) 서버 콘솔(STS/Tomcat)로 폼 제출 시 로그 출력
            을 모두 보여주는 예제.

    환경  : STS 3, Java 11, Tomcat 9 기준 (사용자 환경에 맞춤)
    배치  : 프로젝트의 WebContent/ 또는 src/main/webapp/ 아래에 이 파일을 둔 뒤
            http://localhost:8080/컨텍스트명/name_phone_table.jsp 로 접속.

    핵심 포인트
    - "브라우저 콘솔"은 개발자도구(F12 → Console)에 보이는 로그입니다. (JavaScript console.log)
    - "서버 콘솔"은 STS의 Console 뷰 또는 Tomcat 로그(catalina.out 등)에 보이는 로그입니다. (Java의 System.out.println)
    - JSP 한 파일로 클라이언트/서버 양쪽 콘솔 출력 방식 모두 시연합니다.
--%>

<%--
    ★ 서버측 처리(요청 파라미터 읽기 + 서버 콘솔 출력)
    - 사용자가 "서버 콘솔로 출력" 버튼으로 폼을 제출하면 이 JSP가 다시 호출됩니다(POST).
    - 그 때 넘어온 name, phone 파라미터를 읽어 서버 콘솔(System.out)에 출력합니다.
--%>
<%
    // POST 본문 한글 처리를 위해 파라미터 읽기 전에 인코딩 지정
    request.setCharacterEncoding("UTF-8");

    String name = request.getParameter("name");   // 폼 필드 name 값
    String phone = request.getParameter("phone"); // 폼 필드 phone 값
    String submitted = request.getParameter("submitted"); // 서버 제출 여부 플래그

    // 서버 제출이 명시되었고(숨김 필드) 값이 하나라도 있으면 서버 콘솔에 출력
    if ("true".equals(submitted) && (name != null || phone != null)) {
        System.out.println("[SERVER][name_phone_table.jsp] 받은 값 => name=" + name + ", phone=" + phone);
        // 주의: 이 출력은 브라우저가 아닌 서버 콘솔(STS의 Console 또는 Tomcat 로그)에 보입니다.
    }
%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>이름/전화번호 입력 테이블 (JSP)</title>
    <style>
        /* 보기 좋은 최소 스타일 - 실제 프로젝트에 맞게 조정 가능 */
        body { font-family: sans-serif; line-height: 1.6; margin: 24px; }
        h1 { margin-bottom: 8px; }
        .desc { color: #555; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 500px; max-width: 100%; }
        th, td { border: 1px solid #ddd; padding: 10px; }
        th { background: #f5f5f5; text-align: left; width: 30%; }
        td input[type="text"] { width: 100%; box-sizing: border-box; padding: 8px; }
        .btns { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
        button { padding: 10px 14px; border: 1px solid #ddd; background: #fafafa; cursor: pointer; }
        button:hover { background: #f0f0f0; }
        .server-echo { margin-top: 16px; background: #f9fff4; border: 1px solid #dcefd3; padding: 12px; }
        .tip { font-size: 0.9em; color: #666; margin-top: 6px; }
    </style>
</head>
<body>
    <h1>이름/전화번호 입력</h1>
    <p class="desc">
        아래 테이블에 값을 입력하세요. 입력 중에는 <strong>브라우저 콘솔(F12 → Console)</strong>로 실시간 출력되고, 
        <strong>서버 콘솔</strong>로 출력하려면 "서버 콘솔로 출력" 버튼으로 제출하세요.
    </p>

    <%--
        ★ action: 자기 자신(JSP)으로 제출하여 서버 콘솔 출력까지 한 번에 시연
        ★ method: POST (한글, 보안 측면에서 일반적으로 선호)
    --%>
    <form id="infoForm" action="name_phone_table.jsp" method="post" accept-charset="UTF-8">
        <table>
            <thead>
                <tr>
                    <th>변수명</th>
                    <th>값 입력</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">이름 (name)</th>
                    <td>
                        <%--
                            id/name 속성:
                            - id: JavaScript가 DOM으로 접근할 때 사용
                            - name: 폼 제출 시 서버로 넘어가는 파라미터 키
                        --%>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="홍길동"
                            maxlength="50"
                            autocomplete="name"
                            required
                        />
                    </td>
                </tr>
                <tr>
                    <th scope="row">전화번호 (phone)</th>
                    <td>
                        <%--
                            전화번호 입력 패턴:
                            - 매우 엄격한 검증은 백엔드에서 다시 해야 합니다.
                            - 여기서는 숫자/하이픈 허용, 길이 대략 9~13자 예시
                        --%>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="010-1234-5678"
                            inputmode="tel"
                            pattern="[0-9\-]{9,13}"
                            title="숫자와 하이픈(-)만 입력 (예: 010-1234-5678)"
                            required
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        <%-- 서버 제출 여부를 구분하기 위한 숨김 필드 --%>
        <input type="hidden" id="submitted" name="submitted" value="false" />

        <div class="btns">
            <button id="logBrowserBtn">브라우저 콘솔로 출력</button>
            <button id="logServerBtn" type="submit">서버 콘솔로 출력 (폼 제출)</button>
        </div>
        <p class="tip">* 브라우저 콘솔: F12 → Console 탭에서 확인. / 서버 콘솔: STS Console 또는 Tomcat 로그에서 확인.</p>
    </form>

    <%-- 서버가 방금 받은 값을 화면에도 간단히 에코(선택 사항) --%>
    <%
        if ("true".equals(submitted) && (name != null || phone != null)) {
    %>
        <div class="server-echo">
            서버가 받은 값 → 이름: <strong><%= (name == null ? "" : org.apache.commons.lang.StringEscapeUtils.escapeHtml(name)) %></strong>,
            전화번호: <strong><%= (phone == null ? "" : org.apache.commons.lang.StringEscapeUtils.escapeHtml(phone)) %></strong>
            <div class="tip">※ 위 메시지는 이해를 돕기 위한 화면 표시입니다. 실제 콘솔 출력은 서버 콘솔에서 확인하세요.</div>
        </div>
    <%
        }
    %>

    <script>
        // ★ 클라이언트(브라우저) 측 처리
        // - 입력할 때마다 현재 값을 브라우저 콘솔에 실시간 출력
        // - 버튼 클릭 시 한 번 더 명시적으로 출력
        (function () {
            const nameInput  = document.getElementById("name");
            const phoneInput = document.getElementById("phone");
            const form       = document.getElementById("infoForm");
            const browserBtn = document.getElementById("logBrowserBtn");
            const serverBtn  = document.getElementById("logServerBtn");
            const hiddenSubmit = document.getElementById("submitted");

            // 현재 입력값을 브라우저 콘솔에 보기 좋게 출력하는 함수
            function logToBrowserConsole(prefix) {
                const name  = nameInput.value.trim();
                const phone = phoneInput.value.trim();
                console.log(`${prefix} 이름: "${name}", 전화번호: "${phone}"`);
            }

            // 입력 중 실시간 로그 (필요 없다면 주석 처리 가능)
            const onInput = () => logToBrowserConsole("[브라우저 콘솔][실시간]");
            nameInput.addEventListener("input", onInput);
            phoneInput.addEventListener("input", onInput);

            // "브라우저 콘솔로 출력" 버튼: 폼 제출 막고 콘솔만 출력
            browserBtn.addEventListener("click", function (e) {
                e.preventDefault(); // 폼 전송 방지
                logToBrowserConsole("[브라우저 콘솔][버튼]");
                alert("브라우저 콘솔(F12 → Console)에서 로그를 확인하세요.");
            });

            // "서버 콘솔로 출력" 버튼: 숨김 필드로 서버 제출임을 표시하고 그대로 submit
            serverBtn.addEventListener("click", function () {
                hiddenSubmit.value = "true";
                // submit 이후, 서버측 스크립릿에서 System.out.println으로 서버 콘솔 로그가 남습니다.
            });

            // 페이지가 서버 제출 후 새로 로드된 경우, 브라우저 콘솔에도 한 번 표시(선택 사항)
            <% if ("true".equals(submitted) && (name != null || phone != null)) { %>
                console.log("[브라우저 콘솔][서버 응답] 서버가 방금 받은 값 → 이름: \"<%= name %>\", 전화번호: \"<%= phone %>\"");
            <% } %>
        })();
    </script>
</body>
</html>
