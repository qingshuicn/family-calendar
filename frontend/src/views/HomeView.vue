<template>
    <div class="home-view">
      <h1>家庭日程</h1>
      <div class="layout">
        <CalendarSidebar />
        <div class="main-content">
          <FamilyTabs />
          <ScheduleView />
        </div>
      </div>
    </div>
  </template>
  
  <script src="./HomeView.js"></script>
  <style src="./HomeView.css" scoped></style>