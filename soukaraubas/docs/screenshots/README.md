# Screenshots — SouKaraubas

Capturas geradas automaticamente via Playwright + Chromium em `next start` rodando localmente, sem Supabase configurado (feed cai no mock data).

## Resoluções

- **Desktop**: 1280×800, scale 2x
- **Mobile**: 390×844 (iPhone 14), scale 2x

## Galeria

### Home — `/`
| Desktop | Mobile |
|---|---|
| ![home desktop](./desktop-01-home.png) | ![home mobile](./mobile-01-home.png) |

### Elenco — `/elenco`
| Desktop | Mobile |
|---|---|
| ![elenco desktop](./desktop-02-elenco.png) | ![elenco mobile](./mobile-02-elenco.png) |

### Categoria — `/elenco/principal`
| Desktop | Mobile |
|---|---|
| ![principal desktop](./desktop-03-elenco-principal.png) | ![principal mobile](./mobile-03-elenco-principal.png) |

### Categoria — `/elenco/sub-15`
| Desktop | Mobile |
|---|---|
| ![sub15 desktop](./desktop-04-elenco-sub15.png) | ![sub15 mobile](./mobile-04-elenco-sub15.png) |

### Categoria — `/elenco/futsal-adulto`
| Desktop | Mobile |
|---|---|
| ![futsal desktop](./desktop-05-elenco-futsal.png) | ![futsal mobile](./mobile-05-elenco-futsal.png) |

### Perfil de jogador — `/jogador/j1`
| Desktop | Mobile |
|---|---|
| ![jogador desktop](./desktop-06-jogador-perfil.png) | ![jogador mobile](./mobile-06-jogador-perfil.png) |

### Jogos — `/jogos`
| Desktop | Mobile |
|---|---|
| ![jogos desktop](./desktop-07-jogos.png) | ![jogos mobile](./mobile-07-jogos.png) |

### Feed Público — `/feed?tab=publico`
| Desktop | Mobile |
|---|---|
| ![feed publico desktop](./desktop-08-feed-publico.png) | ![feed publico mobile](./mobile-08-feed-publico.png) |

### Feed Interno (bloqueado pra deslogado) — `/feed?tab=interno`
| Desktop | Mobile |
|---|---|
| ![feed interno desktop](./desktop-09-feed-interno-bloqueado.png) | ![feed interno mobile](./mobile-09-feed-interno-bloqueado.png) |

### Login — `/login`
| Desktop | Mobile |
|---|---|
| ![login desktop](./desktop-10-login.png) | ![login mobile](./mobile-10-login.png) |

### Signup — `/signup`
| Desktop | Mobile |
|---|---|
| ![signup desktop](./desktop-11-signup.png) | ![signup mobile](./mobile-11-signup.png) |

### Conta (deslogado) — `/conta`
| Desktop | Mobile |
|---|---|
| ![conta desktop](./desktop-12-conta-deslogado.png) | ![conta mobile](./mobile-12-conta-deslogado.png) |

### Sobre o clube — `/sobre`
| Desktop | Mobile |
|---|---|
| ![sobre desktop](./desktop-13-sobre.png) | ![sobre mobile](./mobile-13-sobre.png) |

## Como regerar

```bash
cd soukaraubas
pnpm install --ignore-workspace
pnpm build
PORT=3100 pnpm start &
node ../scripts/screenshot.mjs   # após criar o script local
```
