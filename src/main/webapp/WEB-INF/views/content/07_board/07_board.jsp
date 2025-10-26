<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>J2P4 MES System - 게시판</title>

  <!-- Fonts & CSS -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

  <!-- UI 라이브러리 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce@5/tinymce.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tinymce@5/langs/ko.js"></script>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/07_board.css" type="text/css">

  <!-- 페이지 스크립트 (defer: DOM 파싱 후 실행) -->
  <script src="${pageContext.request.contextPath}/resources/js/07_board2.js" defer></script>
</head>

<!-- ★ 추가: data-ctx 로 컨텍스트 경로 주입 -->
<body class="bg-gray-100 text-gray-800 min-h-screen" data-ctx="${pageContext.request.contextPath}">
  <div class="max-w-6xl mx-auto py-8">
    <!-- 상단 바 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">게시판</h1>
      <button id="writePostButton"
              class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700">
        글쓰기
      </button>
    </div>

    <!-- 검색 바 -->
    <div class="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-3">
        <select id="search-criteria" class="p-2 border rounded-lg">
          <option value="title">제목</option>
          <option value="authorName">작성자</option>
          <option value="type">유형</option>
        </select>

        <div class="flex-1 relative">
          <input id="searchInput" type="text" placeholder="검색 내용을 입력하세요."
                 class="w-full p-2 pr-10 border rounded-lg">
          <button id="searchButton" class="absolute right-0 top-0 h-full px-3 text-gray-500">검색</button>
        </div>
      </div>
    </div>

    <!-- 뷰 컨테이너: JSP는 구조만, 내용은 JS가 꽂음 -->
    <main class="main-content">

      <!-- 목록 뷰 -->
      <section id="view-list" class="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">순번</th>
            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">유형</th>
            <th class="py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">제목</th>
            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">작성자</th>
          </tr>
          </thead>
          <tbody id="list-tbody" class="bg-white divide-y divide-gray-200"></tbody>
        </table>

        <div id="empty-list" class="p-8 text-center text-gray-500 hidden">검색 결과가 없습니다.</div>

        <div id="pagination" class="flex justify-center items-center gap-1 p-4"></div>
      </section>

      <!-- 글쓰기/수정 뷰 -->
      <section id="view-write" class="hidden">
        <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 id="write-title" class="text-2xl font-bold mb-6">새 게시글 작성</h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">유형</label>
              <select id="postType" class="w-full p-2 border rounded-lg">
                <option value="">유형 선택</option>
                <option value="안내">안내</option>
                <option value="긴급">긴급</option>
                <option value="공유">공유</option>
                <option value="자유">자유</option>
              </select>
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-medium mb-1">제목</label>
              <input id="postTitle" type="text" class="w-full p-2 border rounded-lg" placeholder="제목을 입력하세요.">
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">내용</label>
            <textarea id="postContentEditor" rows="12" class="w-full p-3 border rounded-lg"></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">첨부 파일</label>
            <div class="p-3 border rounded-lg bg-gray-50">
              <input type="file" id="file-upload" class="hidden" multiple>
              <label for="file-upload" class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm font-medium inline-block">
                파일 선택
              </label>
              <span id="fileNameDisplay" class="ml-3 text-sm text-gray-500">선택된 파일 없음</span>
              <p id="currentFileStatus" class="mt-2 text-xs text-gray-400">현재 파일 첨부: 없음</p>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button id="cancelPostButton" class="py-2 px-4 rounded-lg font-semibold bg-white border">취소</button>
            <button id="savePostButton" data-mode="new" class="py-2 px-4 rounded-lg font-semibold text-white bg-indigo-600">저장</button>
          </div>
        </div>
      </section>

      <!-- 상세 뷰 -->
      <section id="view-detail" class="hidden">
        <div class="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h1 id="detail-title" class="text-3xl font-bold mb-3"></h1>

          <div class="flex items-center gap-4 border-b pb-3 mb-6">
            <span id="detail-type" class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg"></span>
            <span id="detail-author" class="text-sm text-gray-500"></span>
            <span id="detail-date" class="text-sm text-gray-500"></span>
          </div>

          <div id="detail-content" class="prose max-w-none text-gray-800 min-h-[300px] border-b pb-8 mb-8"></div>

          <div class="flex justify-between items-center pt-4 border-t">
            <button id="backToListButton" class="py-2 px-4 rounded-lg font-semibold bg-gray-300 hover:bg-gray-400">
              목록으로
            </button>
            <div class="flex gap-2">
              <button id="deletePostButton" class="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700">삭제</button>
              <button id="editPostButton" class="py-2 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700">수정</button>
            </div>
          </div>
        </div>

        <!-- 댓글 -->
        <div class="mt-6 bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 id="commentCount" class="text-xl font-bold mb-4">0개의 댓글</h3>

          <div class="flex items-start gap-2 p-4 bg-gray-100 rounded-xl mb-6">
            <textarea id="newCommentContent" rows="3" class="w-full p-3 border rounded-lg text-sm"
                      placeholder="댓글을 입력하세요."></textarea>
            <button id="addCommentButton" class="py-3 px-5 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
              등록
            </button>
          </div>

          <div id="commentsContainer" class="space-y-4"></div>
        </div>
      </section>
    </main>
  </div>

  <!-- 커스텀 모달 (alert/confirm/prompt) -->
  <div id="customModal" class="hidden fixed inset-0 bg-black/40 z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md mx-auto mt-40 p-5">
      <h3 id="modalTitle" class="text-lg font-semibold mb-3">알림</h3>
      <p id="modalMessage" class="text-sm text-gray-700 mb-4"></p>
      <div class="flex justify-end gap-2">
        <button id="modalCancelBtn" class="hidden py-2 px-3 bg-gray-200 rounded-lg">취소</button>
        <button id="modalConfirmBtn" class="py-2 px-3 bg-indigo-600 text-white rounded-lg">확인</button>
      </div>
    </div>
  </div>

  <!-- 템플릿: 행/댓글 -->
  <template id="tpl-list-row">
    <tr class="hover:bg-gray-50">
      <td class="td-number py-2 px-4 text-center text-sm font-medium text-gray-900"></td>
      <td class="py-2 px-4 text-center">
        <span class="td-type inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg"></span>
      </td>
      <td class="td-title py-2 px-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600"></td>
      <td class="td-author py-2 px-4 text-center text-sm text-gray-500"></td>
    </tr>
  </template>

  <template id="tpl-comment">
    <div class="comment-item p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
      <div class="flex justify-between items-center mb-2">
        <span class="c-author text-sm font-semibold text-gray-800"></span>
        <div class="flex items-center gap-3">
          <span class="c-time text-xs text-gray-500"></span>
          <button class="btn-edit hidden text-xs text-blue-500 font-medium">수정</button>
          <button class="btn-delete hidden text-xs text-red-500 font-medium">삭제</button>
          <button class="btn-reply text-xs text-indigo-500 font-medium">답글</button>
        </div>
      </div>
      <p class="c-content text-gray-700 text-sm"></p>
    </div>
  </template>

  <template id="tpl-reply-form">
    <div class="reply-form ml-8 mt-3 border-l-2 pl-4 border-gray-100">
      <div class="flex items-start gap-2 p-3 bg-white rounded-lg shadow-inner">
        <textarea rows="2" class="reply-input w-full p-2 border rounded-lg text-sm"></textarea>
        <button class="btn-reply-submit py-2 px-3 bg-indigo-500 text-white rounded-lg text-sm font-semibold">등록</button>
      </div>
    </div>
  </template>
</body>
</html>
