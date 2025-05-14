<?php

/**
 * Class that handles management of data stored in Sqlite3
 */
class DBLink {
  private $db;
  private $queries = [
    'books' => 'select book_id as bi, use_name as un, abbreviation as abr, new_testament as nt, chapter_count as cc from books',
    'versesForth' => 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = :bi and cn = :cn and vn > :vn limit :lm',
    'versesBack' => 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = :bi and cn = :cn and vn >= :vn limit :lm'
  ];

  function __construct() {
    $this->db = new SQLite3('data/es-rv1960', SQLITE3_OPEN_READONLY, "");
  }

  /**
   * Retrieves all books from Sqlite3
   * @return Array of associative data structured as:<br>
   * {bookId, bookName, bookShort, bookTestament, bookChCount}
   */
  function getAllBooks() {
    $books = array();
    $rs = $this->db->query($this->queries['books']);
    while ($row = $rs->fetchArray(SQLITE3_ASSOC)) {
      $books[] = ['bookId' => strval($row['bi']),
                  'bookName' => $row['un'],
                  'bookShort' => $row['abr'],
                  'bookTestament' => strval($row['nt']),
                  'bookChCount' => strval($row['cc'])];
    }
    $rs->finalize();
    return $books;
  }

  /**
   * Retrieves verse data of a given book and chapter based on direction of search
   * @param $vr Array of associative data (VerseRequest) with the structure:<br>
   * <i>bookId: string - Book ID to search<br>
   * chapterNum: string - Chapter of book to get the verses from<br>
   * verseNum: string - Verse search starting point<br>
   * limit: number - Number of verses to fetch<br>
   * forth: boolean - Flag that enables forward search - If false, search is backwards</i>
   * @return Array containing structured data as:<br>
   * <i>{verseId, bookId, chapterNum, verseNum, verseTxt}</i>
   */
  function getVersesOn($vr) {
    $verses = array();
    $query = $vr['forth'] ? $this->queries['versesForth'] : $this->queries['versesBack'];
    $vn = $vr['forth'] ? (empty($vr['verseNum']) ? 0 : $vr['verseNum']) : (intval($vr['verseNum']) === 1 ? 1000 : intval($vr['verseNum']) - $vr['limit']);
    $stmt = $this->db->prepare($query);
    $stmt->bindValue(':bi', $vr['bookId'], SQLITE3_INTEGER);
    $stmt->bindValue(':cn', $vr['chapterNum'], SQLITE3_INTEGER);
    $stmt->bindValue(':vn', $vn, SQLITE3_INTEGER);
    $stmt->bindValue(':lm', $vr['limit'], SQLITE3_INTEGER);
    $rs = $stmt->execute();
    while ($row = $rs->fetchArray(SQLITE3_ASSOC)) {
      $verses[] = ['verseId' => strval($row['id']),
                   'bookId' => strval($row['bi']),
                   'chapterNum' => strval($row['cn']),
                   'verseNum' => strval($row['vn']),
                   'verseTxt' => $row['vt']];
    }
    $rs->finalize();
    $stmt->close();
    return $verses;
  }

  /**
   * Closes the opened Sqlite3 connection
   */
  function close() { $this->db->close(); }

}

?>
