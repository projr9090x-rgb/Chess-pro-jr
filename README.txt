ProJr_v5_all_inclusive - Chess Review Pro Jr (Complete bundle)
---------------------------------------------------------------
Contents:
- index.html
- analysis.js
- chess.min.js
- stockfish.js
- stockfish.wasm
- manifest.json
- service-worker.js
- README.txt

How to run:
1. Unzip the folder on your Android device (or desktop).
2. Open index.html in Chrome. For the most reliable loading of the wasm worker, serve via HTTP (python3 -m http.server) or open in modern Chrome; some browsers disallow workers when opened with file://
3. Wait for "Engine: Stockfish (offline)" to appear.
4. Paste a PGN, choose depth (6-20), press Analyze. Depth selector hides while analyzing.
5. Use "Show Analysis" to view annotated moves, "Export PGN" to save the reviewed game.
