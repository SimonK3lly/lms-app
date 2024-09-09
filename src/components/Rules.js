import React from 'react';
import '../styles/Rules.css';

function Rules() {
  return (
    <div className="page-container">
      <div className="content-container">
        <h1 className="page-title">Last Man Standing Rules</h1>
        <div className="rules-content">
          <h2>How to Play</h2>
          <ol>
            <li>Pick the winner of 1 Premier League match each week. If your selection wins, you progress to the next week. If they lose or draw, you're out.</li>
            <li>You may not pick the same team to win more than once during the tournament (unless the tournament passes 20 weeks).</li>
            <li>All selections must be made at least an hour before the first fixture in the round kicks off.</li>
            <li>If you forget to make your selection in any round, you will automatically be assigned the lowest ranking team which you have not selected previously.</li>
            <li>If any match involving a team you selected is postponed or cancelled for any reason, you will continue to the next round. However, that team will no longer be available for selection.</li>
            <li>If 2 or more participants remain standing and are all eliminated in the same week, they will enter a tiebreaker round. In this round, they must predict the exact score of a designated match. The participant closest to the actual score wins. If still tied, this process repeats until a single winner is determined.</li>
            <li>Rounds of fixtures may take place on weekends or midweek, depending on available fixtures. The competition administrator will decide which fixtures are included for each round.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Rules;