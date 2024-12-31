// Mapping centralisé des icônes
export const cryptoIcons = {
  bitcoin: {
    primary: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png',
    fallback: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  },
  ethereum: {
    primary: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png',
    fallback: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  },
  fantom: {
    primary: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ftm.png',
    fallback: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png'
  }
}

// Image Sonic en base64
const sonicBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0GVYSWZJSSoACAAAAAoAAAEEAAEAAAAgAAAAAQEEAAEAAAAgAAAAAgEDAAMAAACGAAAAEgEDAAEAAAABAAAAGgEFAAEAAACMAAAAGwEFAAEAAACUAAAAKAEDAAEAAAACAAAAMQECAA0AAACcAAAAMgECABQAAACqAAAAaYcEAAEAAAC+AAAAAAAAAAgACAAIAEgAAAABAAAASAAAAAEAAABHSU1QIDIuMTAuMzgAADIwMjQ6MDg6MjAgMDg6MjI6NTgAAQABoAMAAQAAAAEAAAAAAAAA2n9BLgAAAYRpQ0NQSUNDIHByb2ZpbGUAAHicfZE9SMNAHMVfU7VFKgoGEXHIUJ3soiKOtQpFqBBqhVYdzEe/oElDkuLiKLgWHPxYrDq4OOvq4CoIgh8gzg5Oii5S4v+SQosYD4778e7e4+4dwDUqimZ1xQFNt810MiFkc6tC6BVh8OjBEAYkxTLmRDEF3/F1jwBb72Isy//cn6NPzVsKEBCI44ph2sQbxDObtsF4n5hXSpJKfE48YdIFiR+ZLnv8xrjoMscyeTOTnifmiYViB8sdrJRMjXiaOKpqOuVzWY9VxluMtUpNad2TvTCS11eWmU5zFEksYgkiBMiooYwKbMRo1UmxkKb9hI9/xPWL5JLJVYZCjgVUoUFy/WB/8LtbqzA16SVFEkD3i+N8jAGhXaBZd5zvY8dpngDBZ+BKb/urDWD2k/R6W4seAf3bwMV1W5P3gMsdYPjJkEzJlYI0uUIBeD+jb8oBg7dA75rXW2sfpw9AhrpK3QAHh8B4kbLXfd4d7uzt3zOt/n4AUc9ymQ18UrQAAA14aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmYwZmM1ZDkwLTM3ZDMtNDA5ZC05ZWY0LTZmYzIwYmI3OWJmNSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NDFhNGNiMC1lYmRhLTRhMGYtODNjOS00N2JjZDJlYjdhZGIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNzdjODdmZi1mYzUwLTQzNTktOTUxNS03ZjFjNjM2ZWJkMjQiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcyNDEzNDk4MDY4ODg4NSIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjM4IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQ6MDg6MjBUMDg6MjI6NTgrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI0OjA4OjIwVDA4OjIyOjU4KzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2ViMjEyNDUtNzMwMy00NGIzLTk5ZmQtMGNjNzRkNjMxNTQzIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yMFQwODoyMzowMCswMjowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7erhbqAAAABmJLR0QAHQCqAJEy1JMoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AgUBhcA2MZAYgAACalJREFUWMOdl3mQXUd1xn/dfd9y3z4zb/bRjKQRWPLCWFgWtmUZcJmAg43kJMRyQkilYnBCqkgIZjFQhakQXAFSAYIDFTBOAmYxYNnChSvyosi2kEerZUkWzFiSZyTNqnkz89697921mz9GyHJ5LCt01f3j3urb/Z0+p7/zfYILGCZwxcjuxzvH9u262Tk1tjpMZN5Vq88vr8xHODINhQ53wg8fDkVuv8xmfnXFwKX7P7jpJu9C1hbn3Vj74vjm+9a6B3b+g3fi8I2BHxZqMi1cVaAqkrgqjyNSuDKHI20ckcWVyciLeAll3X/Rkub777nrjunfC4Bz8Jedc49t/lL0/GN/YmI/VxU5aiqLIzLUrBw1mcKRORxh0xA2jkrjUMCVFtUoiRtqEwRqopSzvrTxDwe+86H3vcu/YADjT333avl/P/8f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'
export const networkIcons = {
  fantom: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png',
  base: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
  sonic: sonicBase64
}

// Option alternative avec des icônes locales
export const localIcons = {
  crypto: {
    bitcoin: '/crypto-icons/bitcoin.png',
    ethereum: '/crypto-icons/ethereum.png',
    fantom: '/crypto-icons/fantom.png'
  },
  network: {
    fantom: '/network-icons/fantom.png',
    base: '/network-icons/base.svg',
    sonic: sonicBase64
  }
} 