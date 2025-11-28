// Chilean Regions and Communes Data
export interface Commune {
    name: string;
    code: string;
}

export interface Region {
    name: string;
    code: string;
    communes: Commune[];
}

export const CHILEAN_REGIONS: Region[] = [
    {
        name: "Región Metropolitana de Santiago",
        code: "13",
        communes: [
            { name: "Santiago", code: "13101" },
            { name: "Cerrillos", code: "13102" },
            { name: "Cerro Navia", code: "13103" },
            { name: "Conchalí", code: "13104" },
            { name: "El Bosque", code: "13105" },
            { name: "Estación Central", code: "13106" },
            { name: "Huechuraba", code: "13107" },
            { name: "Independencia", code: "13108" },
            { name: "La Cisterna", code: "13109" },
            { name: "La Florida", code: "13110" },
            { name: "La Granja", code: "13111" },
            { name: "La Pintana", code: "13112" },
            { name: "La Reina", code: "13113" },
            { name: "Las Condes", code: "13114" },
            { name: "Lo Barnechea", code: "13115" },
            { name: "Lo Espejo", code: "13116" },
            { name: "Lo Prado", code: "13117" },
            { name: "Macul", code: "13118" },
            { name: "Maipú", code: "13119" },
            { name: "Ñuñoa", code: "13120" },
            { name: "Pedro Aguirre Cerda", code: "13121" },
            { name: "Peñalolén", code: "13122" },
            { name: "Providencia", code: "13123" },
            { name: "Pudahuel", code: "13124" },
            { name: "Quilicura", code: "13125" },
            { name: "Quinta Normal", code: "13126" },
            { name: "Recoleta", code: "13127" },
            { name: "Renca", code: "13128" },
            { name: "San Joaquín", code: "13129" },
            { name: "San Miguel", code: "13130" },
            { name: "San Ramón", code: "13131" },
            { name: "Vitacura", code: "13132" },
            { name: "Puente Alto", code: "13201" },
            { name: "Pirque", code: "13202" },
            { name: "San José de Maipo", code: "13203" },
            { name: "Colina", code: "13301" },
            { name: "Lampa", code: "13302" },
            { name: "Tiltil", code: "13303" },
            { name: "San Bernardo", code: "13401" },
            { name: "Buin", code: "13402" },
            { name: "Calera de Tango", code: "13403" },
            { name: "Paine", code: "13404" },
            { name: "Melipilla", code: "13501" },
            { name: "Alhué", code: "13502" },
            { name: "Curacaví", code: "13503" },
            { name: "María Pinto", code: "13504" },
            { name: "San Pedro", code: "13505" },
            { name: "Talagante", code: "13601" },
            { name: "El Monte", code: "13602" },
            { name: "Isla de Maipo", code: "13603" },
            { name: "Padre Hurtado", code: "13604" },
            { name: "Peñaflor", code: "13605" }
        ]
    },
    {
        name: "Región de Valparaíso",
        code: "05",
        communes: [
            { name: "Valparaíso", code: "05101" },
            { name: "Casablanca", code: "05102" },
            { name: "Concón", code: "05103" },
            { name: "Juan Fernández", code: "05104" },
            { name: "Puchuncaví", code: "05105" },
            { name: "Quintero", code: "05107" },
            { name: "Viña del Mar", code: "05109" },
            { name: "Isla de Pascua", code: "05201" },
            { name: "Los Andes", code: "05301" },
            { name: "Calle Larga", code: "05302" },
            { name: "Rinconada", code: "05303" },
            { name: "San Esteban", code: "05304" },
            { name: "La Ligua", code: "05401" },
            { name: "Cabildo", code: "05402" },
            { name: "Papudo", code: "05403" },
            { name: "Petorca", code: "05404" },
            { name: "Zapallar", code: "05405" },
            { name: "Quillota", code: "05501" },
            { name: "Calera", code: "05502" },
            { name: "Hijuelas", code: "05503" },
            { name: "La Cruz", code: "05504" },
            { name: "Nogales", code: "05506" },
            { name: "San Antonio", code: "05601" },
            { name: "Algarrobo", code: "05602" },
            { name: "Cartagena", code: "05603" },
            { name: "El Quisco", code: "05604" },
            { name: "El Tabo", code: "05605" },
            { name: "Santo Domingo", code: "05606" },
            { name: "San Felipe", code: "05701" },
            { name: "Catemu", code: "05702" },
            { name: "Llaillay", code: "05703" },
            { name: "Panquehue", code: "05704" },
            { name: "Putaendo", code: "05705" },
            { name: "Santa María", code: "05706" },
            { name: "Quilpué", code: "05801" },
            { name: "Limache", code: "05802" },
            { name: "Olmué", code: "05803" },
            { name: "Villa Alemana", code: "05804" }
        ]
    },
    {
        name: "Región del Biobío",
        code: "08",
        communes: [
            { name: "Concepción", code: "08101" },
            { name: "Coronel", code: "08102" },
            { name: "Chiguayante", code: "08103" },
            { name: "Florida", code: "08104" },
            { name: "Hualqui", code: "08105" },
            { name: "Lota", code: "08106" },
            { name: "Penco", code: "08107" },
            { name: "San Pedro de la Paz", code: "08108" },
            { name: "Santa Juana", code: "08109" },
            { name: "Talcahuano", code: "08110" },
            { name: "Tomé", code: "08111" },
            { name: "Hualpén", code: "08112" },
            { name: "Lebu", code: "08201" },
            { name: "Arauco", code: "08202" },
            { name: "Cañete", code: "08203" },
            { name: "Contulmo", code: "08204" },
            { name: "Curanilahue", code: "08205" },
            { name: "Los Álamos", code: "08206" },
            { name: "Tirúa", code: "08207" },
            { name: "Los Ángeles", code: "08301" },
            { name: "Antuco", code: "08302" },
            { name: "Cabrero", code: "08303" },
            { name: "Laja", code: "08304" },
            { name: "Mulchén", code: "08305" },
            { name: "Nacimiento", code: "08306" },
            { name: "Negrete", code: "08307" },
            { name: "Quilaco", code: "08308" },
            { name: "Quilleco", code: "08309" },
            { name: "San Rosendo", code: "08310" },
            { name: "Santa Bárbara", code: "08311" },
            { name: "Tucapel", code: "08312" },
            { name: "Yumbel", code: "08313" },
            { name: "Alto Biobío", code: "08314" }
        ]
    }
    // Agregando más regiones principales...
];

export const getRegions = (): Region[] => {
    return CHILEAN_REGIONS;
};

export const getCommunesByRegion = (regionCode: string): Commune[] => {
    const region = CHILEAN_REGIONS.find(r => r.code === regionCode);
    return region ? region.communes : [];
};

export const searchRegions = (query: string): Region[] => {
    if (!query) return CHILEAN_REGIONS;
    const lowerQuery = query.toLowerCase();
    return CHILEAN_REGIONS.filter(region =>
        region.name.toLowerCase().includes(lowerQuery)
    );
};

export const searchCommunes = (regionCode: string, query: string): Commune[] => {
    const communes = getCommunesByRegion(regionCode);
    if (!query) return communes;
    const lowerQuery = query.toLowerCase();
    return communes.filter(commune =>
        commune.name.toLowerCase().includes(lowerQuery)
    );
};
