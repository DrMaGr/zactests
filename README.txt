Zac's Knowledge Tracker — Version .06
Corrected MC answer order + one-time French result reset

INSTALL
1. Open https://github.com/DrMaGr/zactests
2. In the repository root, replace ONLY exam-06-app.js with the copy in this package.
3. Commit the file replacement.
4. In the SAME browser/device that recorded Zac's French .06 49/50,
   visit https://drmagr.github.io/zactests/exam-06.html
   and use Ctrl+Shift+R to refresh.

WHAT THIS FIXES
- Shuffles the displayed answers across A/B/C/D in English, Science,
  Humanities, French and Maths in .06.
- Balances the correct letter for each full-subject or topic session,
  without changing the question bank, correct answer indexes, marking,
  hints or explanations.
- Displays a consistent order when a saved session is resumed.
- On first load, checks the local guided .06 history for Zac's
  completed 49-independent-out-of-50 French session from the old
  predictable-answer implementation. Deletes only that specific
  matching finished result from local guided .06 history.
- Refreshes the French .06 history/radar chart from the remaining records.
- Leaves other subjects, earlier versions .01–.05, unrelated
  French sessions and exported JSON files untouched.
- Shows a confirmation notice if the targeted record was found and reset.

IMPORTANT
- GitHub Pages does not store individual results on the server.
  Completed guided .06 results are in each browser's localStorage.
- The reset therefore happens ONLY in the same browser profile/device
  that holds that finished result, AFTER loading the updated page.
- If Zac used a different browser or device, open the updated page there.
- If there is no 49/50 French guided-history record in that browser,
  this patch will not delete anything.
- The migration runs only once per browser; future legitimate results
  using the corrected answer order will not be removed.
- No need to upload exam-06-bank.js, exam-06.html, or index.html.

TESTS
Verified in Chromium with simulated localStorage and all 170 .06 MC
questions. Correct answer position counts across A/B/C/D:
English: 9/9/9/8
Science: 11/11/11/11
Humanities: 9/8/8/8
French: 9/9/9/9
Maths: 6/6/5/5

All saved result indices remain original bank indices, so question
review and marks calculate against the correct answers.
