This is a port of much of the underlying Art Tracks logic from Ruby to Javascript.  Currently, it just includes the Date logic.

This is very much a work in progress and very much under development.  Things won't work like you expect them to.

It uses the Nearley.js parser to process the underlying syntax.  These grammars are (as you'd expect) within the `grammars/` folder with the `.ne` extension.  There's a script at `bin/update_nearly.sh` that will compile the `.ne` files into javascript files, and `npm run grammar` will watch those files and recompile on save.

Tests can be run with `npm run test` or can be run continuously with `npm run watch`.



---

### Dates still to be processed:

        1667-[1690s?]
        1667-ca.1700
        1859-2013 (bulk 1954-2012)
        1890-1939 (bulk 1890-1910)
        1897-1985 (bulk 1954-1978)
        1899- approximately 1920
        19--?
        1902 January 16-February3
        1910 January 31-Ferbuary 5
        1911 March 21 -1911 June 18
        1912 Septermber 19
        1915 Ferbuary 8
        1915 January 25-Ferbuary 6
        1916 [June?] 28-1917 June
        1917 Apirl 16-28
        1917 November 5-
        1918 Marhc 11-23
        1920 Marcy 16-20
        1921 December 15-1922 [June?] 5
        1921 March 31-1921 November 31
        1923 Ferbuary 19-March 5
        1923: Automne/hiver
        1924 1953
        1924-1957 (bulk 1943-1957)
        1929: Automne/hiver
        1931 October 20-1932 Novemeber 16
        1931 Spring-Autumn
        1934 November 1- December 1
        1935 [sic]
        1936 January 20-Ferbuary 8
        1939 June 24-September
        1946 Apri 29-May 18
        1947-1998 (bulk 1947-1957)
        1948-1994 n.d.
        1949 1988
        1950 April 29 and 1950 May 1
        1952 1960
        1952 June 12 and 1952 July 8
        1952 October 52-November 1
        1952-ca.1964
        1954 May [19?]-1958 September 29
        1954 November 16-December
        1954 October 30-Movember 17
        1956 Spring
        1958-1997 n.d.
        1959 Sepember 19-October 10
        1960 1969
        1960 September 16-October
        1960-
        1966 restored 2001
        1966/2001
        1968-1997 (bulk 1968-1971)
        1969 1994
        1970's
        1970- 2008
        1971 1995-1997
        1972 1974
        1973 1980-1982
        1975- 1976
        1977-1985 undated
        1977-1996 undated
        1978 1979
        1979 Mar. 13.
        1980 1986
        1981 1982
        1981- June 1983
        1982 February 2- March 12
        1982-1994 and undated
        1984=1989
        1988 undated
        2002 Dicembre
        2003 February 25-26; 2003 March 27
        2008 August 28 and 31; 2008 September 1
        April
        April 1990-1991/1992 (April)
        April-July
        August
        August-September
        Copyrighted 1890 by Gebbie & Co.
        Dec 2 1986.
        December
        Fall 1988
        Fall 1995
        February
        Giugno 1847.
        Jan-Feb 1993
        January
        July
        June
        March
        March-April 1974
        May
        May-July
        November
        October
        Sept 1988- April 1990
        September
        Spring 1985
        Spring 2006
        Summer 1988
        Undated
        [15--?]
        [15--]
        [1550]
        [1582]
        [1592]
        [16--?]
        [16--]
        [1627]
        [1635?]
        [1635]
        [1654]
        [1661]
        [1662?]
        [1667]
        [168-?]
        [1682]
        [1690]
        [17--?]
        [17--]
        [172-]
        [1720]
        [1727]
        [1761]
        [1764]
        [1768]
        [18--]
        [1804]
        [1814]
        [183-]
        [188-]
        [189-]
        [1893?]
        [19--]
        [London] : Published by Tho.s Cook engraver & printer N°11 Hay Market Oct.r         21st 1805
        [ca. 1589-1592]
        [ca. 1595]
        [ca. 1599]
        [ca. 1616]
        [ca. 1617]
        [ca. 1618-ca. 1620]
        [ca. 1620-1623]
        [ca. 1621]
        [ca. 1637]
        [ca. 1645]
        [ca. 1652]
        [ca. 1658]
        [ca. 1661]
        [ca. 1662?]
        [ca. 1662]
        [ca. 1674]
        [ca. 1675]
        [ca. 1679?]
        [ca. 1680]
        [ca. 1682]
        [ca. 1683-ca. 1687]
        [ca. 1685]
        [ca. 1687]
        [ca. 1688]
        [ca. 1689]
        [ca. 1690]
        [ca. 1695]
        [ca. 17--?]
        [ca. 1707]
        [ca. 1716- ca. 1742]
        [ca. 1716-ca. 1742]
        [ca. 1723]
        [ca. 1724]
        [ca. 1728]
        [ca. 1729-ca. 1732]
        [ca. 1729]
        [ca. 1731]
        [ca. 1733]
        [ca. 1740]
        [ca. 1750-ca. 1785]
        [ca. 1759]
        [ca. 1761]
        [ca. 1762]
        [ca. 1782]
        [ca. 1829]
        [ca. 1842]
        [ca. 1845]
        [ca. 1850]
        [ca. 1863?]
        [ca. 1864]
        [ca. 1867-ca. 1878]
        [ca. 1874]
        [ca. 1908-ca. 1911]
        [ca. 1930-ca. 1954]
        [not after 1890]
        bulk 1952-1959
        ca.1960- ca.1986
        circa 1940/1980
        circa 1942- circa 1992
        circa 1950/2001-2003
        circa 1985 to circa 1986
        late 1920s-1964
        late 1970s-1981
        late 1970s-2018
        late 1980s
        n.d
        n.d.
        n.d. (after 1970)
        not after 1994
        probably 1954
        probably 1965
        probably 1993
        test MMS
        unadted
        undated [1956?]
        undated [after 1977]
        undated?
        untitled