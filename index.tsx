// Las importaciones de React y ReactDOM se eliminan porque se cargan como globales en index.html
const { useState, useEffect, useRef, Fragment } = React;

// =============================================================================
// == TYPES (from types.ts)
// =============================================================================
interface Teacher {
  nombreCompleto: string;
  curp: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  dates: string;
  period: string;
  hours?: number;
  location: string;
  schedule: string;
  type: string;
}

interface FormData {
  fullName: string;
  curp: string;
  email: string;
  gender: string;
  department: string;
  selectedCourses: string[];
}

interface RegistrationResult {
  courseName: string;
  registrationId: string;
}

// FIX: Omitted 'selectedCourses' from FormData to avoid type conflict.
interface SubmissionData extends Omit<FormData, 'selectedCourses'> {
  timestamp: string;
  selectedCourses: {
    id: string;
    name: string;
    dates: string;
    location: string;
    schedule: string;
  }[];
}

// =============================================================================
// == API SERVICE (from services/api.ts)
// =============================================================================
const mockTeachers: Teacher[] = [
    { nombreCompleto: 'AARÓN CUAUHTÉMOC VARGAS FIERRO', curp: '', email: 'aaron.vargas@itdurango.edu.mx' },
    { nombreCompleto: 'ABRAHAM LERMA HEREDIA', curp: '', email: 'a.lerma@itdurango.edu.mx' },
    { nombreCompleto: 'ADÁN MEDINA NÚÑEZ', curp: 'MENA800405HDGDXD04', email: 'adan.medina@itdurango.edu.mx' },
    { nombreCompleto: 'ADOLFO RUIZ SOTO', curp: 'RUSA781202HDGZTD09', email: 'adolforuiz@itdurango.edu.mx' },
    { nombreCompleto: 'ADRIÁN CALDERÓN FLORES', curp: 'CAFA410922HDGLLD07', email: 'adrian.calderon@itdurango.edu.mx' },
    { nombreCompleto: 'ADRIANA ERÉNDIRA MURILLO', curp: 'MUXA741025MDGRXD08', email: 'amurillo@itdurango.edu.mx' },
    { nombreCompleto: 'ADRIANA ROBLEDO PERALTA', curp: '', email: 'adriana.robledo@itdurango.edu.mx' },
    { nombreCompleto: 'AGUEDA VÁZQUEZ RUBIO', curp: 'VARA740417MDGZBG04', email: 'agueda.vazquez@itdurango.edu.mx' },
    { nombreCompleto: 'AGUSTÍN CASTAÑEDA VELEZ', curp: '', email: 'agustin.castaneda@itdurango.edu.mx' },
    { nombreCompleto: 'AGUSTÍN CERVANTES GÓMEZ', curp: 'CEGA610109HDGRMG02', email: 'acervantes@itdurango.edu.mx' },
    { nombreCompleto: 'AÍDA ARACELI NÚÑEZ HERNÁNDEZ', curp: 'NUHA820730MDGXRD08', email: 'aidanunez@itdurango.edu.mx' },
    { nombreCompleto: 'ALBERTO AYALA PARTIDA', curp: 'AAPA640407HDGYRL08', email: 'aayala@itdurango.edu.mx' },
    { nombreCompleto: 'ALBERTO RAMÍREZ MÁRQUEZ', curp: 'RAMA790821HDGMRL04', email: 'aramirez@itdurango.edu.mx' },
    { nombreCompleto: 'ALDO DAVID PORRAS SANDOVAL', curp: 'POSA800318HDGRNL08', email: 'aldo.porras@itdurango.edu.mx' },
    { nombreCompleto: 'ALDO FRANCISCO TAGLIAPIETRA LOERA', curp: 'TALA570914HDGGRL00', email: 'aftagliapietra@itdurango.edu.mx' },
    { nombreCompleto: 'ALEJANDRO CALDERÓN RENTERÍA', curp: 'CARA690425HDGLNL03', email: 'alejandro.calderon@itdurango.edu.mx' },
    { nombreCompleto: 'ALEJANDRO LUNA HURTADO', curp: '', email: 'aluna@itdurango.edu.mx' },
    { nombreCompleto: 'ALEJANDRO MENDOZA RAMÍREZ', curp: 'MERA820509HDGNML05', email: 'amendoza@itdurango.edu.mx' },
    { nombreCompleto: 'ALEJANDRO VALENZUELA SILERIO', curp: 'VASA900201HDGLLL08', email: 'avalenzuela@itdurango.edu.mx' },
    { nombreCompleto: 'ALFONSO FLORES SALINAS', curp: 'FOSA501213HDGLLL05', email: 'alfonso.flores@itdurango.edu.mx' },
    { nombreCompleto: 'ALFREDO CÓRDOVA QUIÑONES', curp: 'COQA691109HDGRXL00', email: 'alfredocordova@itdurango.edu.mx' },
    { nombreCompleto: 'ALFREDO LOZANO MUÑOZ', curp: 'LOMA590418HDGZXL00', email: 'alozano@itdurango.edu.mx' },
    { nombreCompleto: 'ALFREDO RODRÍGUEZ RAMÍREZ', curp: '', email: 'arodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'ALICIA JANETH TORRES MERAZ', curp: 'TOMA920515MDGRRL03', email: 'torres@itdurango.edu.mx' },
    { nombreCompleto: 'ALMA CITLALI VÁSQUEZ MORENO', curp: 'VAMA620213MDGSRL00', email: 'alma.vasquez@itdurango.edu.mx' },
    { nombreCompleto: 'ALONDRA SOTO CABRAL', curp: 'SOCA840706MDGTBL06', email: 'alondra.soto@itdurango.edu.mx' },
    { nombreCompleto: 'AMELIA SORIA HERNÁNDEZ', curp: 'SOHA530222MDGRRM01', email: 'asoriah711@itdurango.edu.mx' },
    { nombreCompleto: 'AMPARO QUIÑONES PÉREZ', curp: 'QUPA750503MDGXRM05', email: 'amparoquinones@itdurango.edu.mx' },
    { nombreCompleto: 'ANA LUISA MOORILLÓN SOTO', curp: 'MOSA770615MDGRTN03', email: 'amoorillon@itdurango.edu.mx' },
    { nombreCompleto: 'ANA PATRICIA GALLEGOS FRANCO', curp: 'GAFA720623MDGLRN06', email: 'anapaty@itdurango.edu.mx' },
    { nombreCompleto: 'ANAPAULA RIVAS BARRAZA', curp: 'RIBA780801MDGVRN01', email: 'arivas@itdurango.edu.mx' },
    { nombreCompleto: 'ANDREA SUSANA MITRE VALDÉS', curp: 'MIVA851230MDGTLN09', email: 'andreamitre@itdurango.edu.mx' },
    { nombreCompleto: 'ANGÉLICA MÁRQUEZ BURCIAGA', curp: 'MABA791016MDGRRN03', email: 'angelica.marquez@itdurango.edu.mx' },
    { nombreCompleto: 'ANÍBAL ROBERTO SAUCEDO ROSALES', curp: 'SARA760315HZSCSN09', email: 'asaucedo@itdurango.edu.mx' },
    { nombreCompleto: 'ANTONIO ERNESTO RESÉNDIZ CISNEROS', curp: 'RECA530613HDGSSN01', email: 'aresendiz@itdurango.edu.mx' },
    { nombreCompleto: 'ANTONIO RAMÍREZ RAÚL', curp: 'RAXR691113HDGMXL09', email: 'rramirez@itdurango.edu.mx' },
    { nombreCompleto: 'ANTONIO SOSA QUIROGA', curp: 'SOQA610612HDGSRN01', email: 'antoniososaq@itdurango.edu.mx' },
    { nombreCompleto: 'ARACELI SOLEDAD DOMÍNGUEZ FLORES', curp: 'DOFA710724MDGMLR06', email: 'adominguez@itdurango.edu.mx' },
    { nombreCompleto: 'ARELLANO HERNÁNDEZ KARLA SELENE', curp: '', email: 'karla.arellano@itdurango.edu.mx' },
    { nombreCompleto: 'ARIANA CLARISA SOTO ALMODÓVAR', curp: 'SOAA860620MDGTLR06', email: 'ariana.soto@itdurango.edu.mx' },
    { nombreCompleto: 'ARMANDO ORTÍZ ARAGÓN', curp: 'OIAA670613HDGRRR07', email: 'aortiz@itdurango.edu.mx' },
    { nombreCompleto: 'ARTEMIO GARCÍA SANTOYO', curp: 'GASA530112HDGRNR01', email: 'artemiogarcia@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO ELISEO RIVERA ARANDA', curp: 'RIAA521027HDGVRR00', email: 'arturorivera@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO MUÑOZ BLANCO', curp: 'MUBA530408HDGXLR05', email: 'arturo.blanco@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO RIVERA CASTAÑEDA', curp: 'RICA790218HDGVSR06', email: 'arivera@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO SOTO CABRAL', curp: 'SOCA811002HDGTBR05', email: 'arturo.soto.c@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO SOTO SOTO', curp: 'SOSA520901HDGTTR08', email: 'as@itdurango.edu.mx' },
    { nombreCompleto: 'ARTURO TAVIZÓN SALAZAR', curp: '', email: 'arturo.tavizon@itdurango.edu.mx' },
    { nombreCompleto: 'AURELIO CASTILLO LIÑÁN', curp: 'CALA560717HTSSXR05', email: 'acastillo@itdurango.edu.mx' },
    { nombreCompleto: 'AZENETH DE LUNA GALVÁN', curp: 'LUGA711016MCLNLZ09', email: 'azenethdeluna@itdurango.edu.mx' },
    { nombreCompleto: 'BLANCA ELIZABETH MORALES CONTRERAS', curp: '', email: 'bmorales@itdurango.edu.mx' },
    { nombreCompleto: 'BLANCA ESTELA GARCÍA CABALLERO', curp: '', email: 'bgarcia@itdurango.edu.mx' },
    { nombreCompleto: 'BRENDA DE LA LUZ AVITIA ROCHA', curp: 'AIRB630718MDGVCR04', email: 'brenda.avitia@itdurango.edu.mx' },
    { nombreCompleto: 'BRENDA ELIZABETH ALE CRUZ', curp: 'AECB851226MDGLRR06', email: 'brenda_ale@itdurango.edu.mx' },
    { nombreCompleto: 'BRENDA NAYELI HERNÁNDEZ ELÍAS', curp: '', email: 'brenda.hernandez@itdurango.edu.mx' },
    { nombreCompleto: 'BRENDA PALOMA GÓMEZ LOZANO', curp: 'GOLB831113MDGMZR20', email: 'bpgomez@itdurango.edu.mx' },
    { nombreCompleto: 'BRISEIDA LARA ORTIZ', curp: 'LAOB800630MDGRRR18', email: 'briseidalara@itdurango.edu.mx' },
    { nombreCompleto: 'BRIZA IMELDA MUÑOZ OCHOA', curp: 'MUOB820130MDGXCR08', email: 'brisa.munoz@itdurango.edu.mx' },
    { nombreCompleto: 'CAMILO ENRIQUE CONDE LIMON', curp: 'COLC920528HDGNMM02', email: 'enrique.conde@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS ALEJANDRO VÁSQUEZ MARTÍNEZ', curp: 'VAMC890614HOCSRR07', email: 'alejandrovasquez@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS DAVID VILLEGAS VILLARREAL', curp: 'VIVC790809HDGLLR06', email: 'cvillegas@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS EDUARDO CALDERÓN PÉREZ', curp: 'CAPC570216HDGLRR07', email: 'cecalderon@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS EDUARDO MERAZ CASTRO', curp: 'MECC800505HDGRSR09', email: 'cemeraz@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS ENRIQUE MONTES CASAS', curp: 'MOCC510819HDGNSR07', email: 'carlos.montes@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS FRANCISCO CRUZ FIERRO', curp: 'CUFC760908HDFRRR15', email: 'carlosfrancisco.cruz@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS GALEANA DÁVILA', curp: 'GADC791123HDGLVR09', email: 'carlos.galeana@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS JAVIER TELUMBRE ALVARADO', curp: 'TEAC810415HDGLLR02', email: 'carlos.telumbre@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS LEONARDO RUIZ RODRÍGUEZ', curp: 'RURC700406HDGZDR14', email: 'carlos.ruiz@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS OMAR RÍOS OROZCO', curp: 'RIOC821114HDGSRR09', email: 'omar.rios@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS ORTEGA GALLARDO', curp: 'OEGC540913HDFRLR03', email: 'cortega@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS QUIÑONES GARCÍA', curp: 'QUGC650531HDGXRR09', email: 'charliq@itdurango.edu.mx' },
    { nombreCompleto: 'CARLOS VALENZUELA MARTÍNEZ', curp: 'VAMC890710HDGLRR02', email: 'cvalenzuela@itdurango.edu.mx' },
    { nombreCompleto: 'CÉLIDA CÓRDOVA NAVARRO', curp: 'CONC800801MDGRVL08', email: 'ccordova@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR ALBERTO ZUBIA GONZÁLEZ', curp: 'ZUGC720811HDGBNS01', email: 'cesarzubia@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR ALFONSO VALDEZ RAMÍREZ', curp: 'VARC700217HDGLMS00', email: 'avaldez@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR ARTURO IBARRA SAMANIEGO', curp: 'IASC570124HDGBMS01', email: 'caibarra@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR IVÁN BARRAZA CASTAÑEDA', curp: 'BACC721118HDGRSS05', email: 'ivanbarraza@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR PORFIRIO VARELA RAMÍREZ', curp: 'VARC610515HDGRMS01', email: 'cpvarela@itdurango.edu.mx' },
    { nombreCompleto: 'CÉSAR VINICIO SÁENZ RUIZ', curp: 'SARC650512HDGNZS09', email: 'vin.saenz@itdurango.edu.mx' },
    { nombreCompleto: 'CLAUDIA VIOLETA GARZA NAVA', curp: '', email: 'cgarza@itdurango.edu.mx' },
    { nombreCompleto: 'CONCEPCIÓN MARGARITA MORALES LAVEAGA', curp: 'MOLC601208MDGRVN03', email: 'laveaga@itdurango.edu.mx' },
    { nombreCompleto: 'CRISTABEL ARMSTRONG ARÁMBURO', curp: 'AOAC791230MCHRRR08', email: 'cristabel@itdurango.edu.mx' },
    { nombreCompleto: 'CRISTINA SALAZAR DE LA PEÑA', curp: 'SAPC900626MDGLXR08', email: 'cristina.salazar@itdurango.edu.mx' },
    { nombreCompleto: 'CRISTINA VILLALVAZO CARRILLO', curp: '', email: 'cristina.villalvazo@itdurango.edu.mx' },
    { nombreCompleto: 'CRUZ GUERRERO MATRÓN PACHECO', curp: 'MAPC700503HCHTCR04', email: 'cruz_matron@itdurango.edu.mx' },
    { nombreCompleto: 'CUAUHTÉMOC SEGOVIA SOTO', curp: 'SESC540612HDGGTH06', email: 'cuauhtemoc.segovia@itdurango.edu.mx' },
    { nombreCompleto: 'CYNTHIA MARLENE TORRES NÚÑEZ', curp: 'TONC810910MDGRXY09', email: 'ctorres@itdurango.edu.mx' },
    { nombreCompleto: 'DAMIÁN REYES JÁQUEZ', curp: 'REJD811022HDGYQM02', email: 'damian.reyes@itdurango.edu.mx' },
    { nombreCompleto: 'DANIEL GERARDO MURO CERVANTES', curp: 'MUCD890110HDGRRN06', email: 'daniel.muro@itdurango.edu.mx' },
    { nombreCompleto: 'DANIEL MONCISVÁIS GONZÁLEZ', curp: 'MOGD630314HDGNNN07', email: 'daniel.moncisvais@itdurango.edu.mx' },
    { nombreCompleto: 'DAVID ALONSO RUVALCABA MORALES', curp: 'RUMD810809HDGVRV07', email: 'davidruvalcaba@itdurango.edu.mx' },
    { nombreCompleto: 'DIANA BERENICE HERNÁNDEZ HERNÁNDEZ', curp: '', email: 'dianahernandez@itdurango.edu.mx' },
    { nombreCompleto: 'DIANA LAURA RICALDAY VENEGAS', curp: 'RIVD771208MDGCNN04', email: 'diana.ricalday@itdurango.edu.mx' },
    { nombreCompleto: 'DIANA VALERIA BARRAZA CASTAÑEDA', curp: 'BACD820712MDGRSN04', email: 'diana.barraza@itdurango.edu.mx' },
    { nombreCompleto: 'DIDIER AMAYA MORALES', curp: 'AAMD730427HDGMRD05', email: 'didier.amaya@itdurango.edu.mx' },
    { nombreCompleto: 'DORA LUZ GONZÁLEZ BAÑALES', curp: 'GOBD710217MDGNXR02', email: 'doraglez@itdurango.edu.mx' },
    { nombreCompleto: 'DULCE MARÍA REYES HINOSTROZA', curp: 'REHD820617MDGYNL01', email: 'dmreyes@itdurango.edu.mx' },
    { nombreCompleto: 'DUSTIN ATZAEL MUÑOZ BAYONA', curp: 'MUBD880506HDGXYS01', email: 'dustin.bayona@itdurango.edu.mx' },
    { nombreCompleto: 'EDEL PÉREZ ESPARZA', curp: '', email: 'eperez@itdurango.edu.mx' },
    { nombreCompleto: 'EDELMIRA BARRAGÁN GALLEGOS', curp: 'BAGE580718MCHRLD08', email: 'ebarragan@itdurango.edu.mx' },
    { nombreCompleto: 'EDGAR HIRAM ROSALES CESARETTI', curp: 'ROCE791026HDGSSD05', email: 'ehrosales@itdurango.edu.mx' },
    { nombreCompleto: 'EDGAR RENÉ PORRAS MORA', curp: 'POME730707HDGRRD04', email: 'rporras@itdurango.edu.mx' },
    { nombreCompleto: 'EDILBERTO ESCALERA GALVÁN', curp: 'EAGE760723HDGSLD01', email: 'edilberto.escalera@itdurango.edu.mx' },
    { nombreCompleto: 'EDITH VALDERRAMA VELÁZQUEZ', curp: 'VAVE760415MDGLLD06', email: 'edithvalderrama@itdurango.edu.mx' },
    { nombreCompleto: 'EDITH XÓCHITL MIRANDA ESPINOSA', curp: 'MIEE700824MDGRSD04', email: 'exmiranda@itdurango.edu.mx' },
    { nombreCompleto: 'EDMUNDO JAVIER SOTO GARCÍA', curp: 'SOGE790320HDGTRD05', email: 'ingedmundo@itdurango.edu.mx' },
    { nombreCompleto: 'EDNA RAQUEL VILLAFAÑA MONTERO', curp: 'VIME670609MDGLND05', email: 'edna.villafana@itdurango.edu.mx' },
    { nombreCompleto: 'EDUARDO CHÁVEZ PÉREZ', curp: 'CAPE710305HDGHRD00', email: 'echavez@itdurango.edu.mx' },
    { nombreCompleto: 'EDUARDO GAMERO INDA', curp: 'GAIE590828HDFMND09', email: 'egamero@itdurango.edu.mx' },
    { nombreCompleto: 'EDUARDO PORRAS BOLÍVAR', curp: 'POBE510510HDGRLD07', email: 'eporras@itdurango.edu.mx' },
    { nombreCompleto: 'EFRAÍN CASTELLANOS FRAYRE', curp: 'CAFE820716HDGSRF00', email: 'e.castellanos@itdurango.edu.mx' },
    { nombreCompleto: 'EFRÉN MONCISVALLES MARTÍNEZ', curp: 'MOME830116HDGNRF06', email: 'emoncisvalles@itdurango.edu.mx' },
    { nombreCompleto: 'EFRÉN MONCISVALLES QUIÑONES', curp: 'MOQE450609HDGNXF00', email: 'efren.moncisvalles@itdurango.edu.mx' },
    { nombreCompleto: 'EIRA OLIVIA VILLARREAL RIVOTA', curp: 'VIRE851202MDGLVR01', email: 'evillarreal@itdurango.edu.mx' },
    { nombreCompleto: 'ELDA RIVERA SAUCEDO', curp: 'RISE730908MDGVCL04', email: 'erivera@itdurango.edu.mx' },
    { nombreCompleto: 'ELIO EDUARDO MONREAL CARRILLO', curp: 'MOCE760914HDGNRL03', email: 'emonreal@itdurango.edu.mx' },
    { nombreCompleto: 'ELIZABETH SORAYA VILLARREAL REYES', curp: 'VIRE810126MDGLYL09', email: 'evillareal@itdurango.edu.mx' },
    { nombreCompleto: 'ELUARD ARRIETA MATURINO', curp: 'AIME760515HDGRTL00', email: 'eluard.arrieta@itdurango.edu.mx' },
    { nombreCompleto: 'ELVA MARCELA CORIA QUIÑONES', curp: 'COQE600426MDGRXL03', email: 'e.coria@itdurango.edu.mx' },
    { nombreCompleto: 'ELVIA VÁSQUEZ CRUZ', curp: '', email: 'elviavazquezc@itdurango.edu.mx' },
    { nombreCompleto: 'EMMA LUZ VANEGAS PARRA', curp: 'VAPE791026MDGNRM01', email: 'emma.vanegas@itdurango.edu.mx' },
    { nombreCompleto: 'ENRIQUE TORRES JESÚS', curp: 'TOXJ540717HDGRXS08', email: 'jesustorres@itdurango.edu.mx' },
    { nombreCompleto: 'ERASMO GALLEGOS DE LA HOYA', curp: 'GAHE640117HDGLYR08', email: 'egallegos@itdurango.edu.mx' },
    { nombreCompleto: 'ERIKA YESENIA MUÑOZ SOLÍS', curp: 'MUSE840513MDGXLR06', email: 'erika.solis@itdurango.edu.mx' },
    { nombreCompleto: 'ESTEBAN BERMÚDEZ RAMÍREZ', curp: 'BERE801226HDGRMS08', email: 'esteban.bermudez@itdurango.edu.mx' },
    { nombreCompleto: 'ESTEBAN LUJÁN MESTA', curp: 'LUME820516HDGJSS05', email: 'elujan@itdurango.edu.mx' },
    { nombreCompleto: 'ESTHER SOTO GARCÍA', curp: 'SOGE640905MBCTRS03', email: 'e.soto@itdurango.edu.mx' },
    { nombreCompleto: 'EUSEBIO MUÑOZ RÍOS', curp: 'MURE620814HDGXSS09', email: 'eusebio.munoz@itdurango.edu.mx' },
    { nombreCompleto: 'EUSTOLIA NÁJERA JÁQUEZ', curp: 'NAJE530419MDGJQS05', email: 'enajera@itdurango.edu.mx' },
    { nombreCompleto: 'EVARISTO ÁLVAREZ MENDOZA', curp: 'AAME500114HDGLNV05', email: 'evaristo.alvarez@itdurango.edu.mx' },
    { nombreCompleto: 'FABIÁN REYES AGUILERA', curp: 'REAF781223HDGYGB05', email: 'fabian.reyes@itdurango.edu.mx' },
    { nombreCompleto: 'FABIOLA MARGARITA SALAZAR MUÑOZ', curp: '', email: 'fabiola.salazar@itdurango.edu.mx' },
    { nombreCompleto: 'FÁTIMA JANETH GARCÍA CURIEL', curp: 'GACF860704MDGRRT07', email: 'fatimagarcia@itdurango.edu.mx' },
    { nombreCompleto: 'FELIPE ALANÍS GONZÁLEZ', curp: 'AAGF610309HCLLNL02', email: 'falanis@itdurango.edu.mx' },
    { nombreCompleto: 'FELIPE SAMUEL HERNÁNDEZ RODARTE', curp: 'HERF670409HDGRDL05', email: 'shernandez@itdurango.edu.mx' },
    { nombreCompleto: 'FERMÍN AGUSTÍN ÁLVAREZ MARTÍNEZ', curp: 'AAMF460707HDGLRR13', email: 'fermin.alvarez@itdurango.edu.mx' },
    { nombreCompleto: 'FERNANDO AYALA PARTIDA', curp: 'AAPF740906HDGYRR02', email: 'fayala@itdurango.edu.mx' },
    { nombreCompleto: 'FERNANDO BLANCO CASTAÑEDA', curp: 'BACF780219HDGLSR02', email: 'fernando.blancoc@itdurango.edu.mx' },
    { nombreCompleto: 'FLOR CELILIA CALDERÓN HERRERA', curp: '', email: 'fcalderon@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCA MARÍA SANDOVAL HIPÓLITO', curp: 'SAHF830118MDGNPR01', email: 'msandoval@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO ALBERTO BARRENA RODRÍGUEZ', curp: 'BARF770803HDGRDR06', email: 'fbarrena@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO JAVIER CALDERÓN', curp: '', email: 'fxklderon@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO JAVIER GARCÍA LÓPEZ', curp: 'GALF461004HDGRPR08', email: 'fcogarcialopez@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO JAVIER GODÍNEZ GARCÍA', curp: 'GOGF581009HDGDRR05', email: 'fgodinez@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO PALACIOS RODRÍGUEZ', curp: 'PARF640404HDGLDR09', email: 'fpalacios@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO PARDO LIZÁRRAGA', curp: 'PALF601015HSLRZR07', email: 'francisco.pardo@itdurango.edu.mx' },
    { nombreCompleto: 'FRANCISCO PORRAS ROBLES', curp: '', email: 'francisco.porras@itdurango.edu.mx' },
    { nombreCompleto: 'GABRIEL ARTURO LUGO MORALES', curp: 'LUMG700725HDGGRB05', email: 'alugo@itdurango.edu.mx' },
    { nombreCompleto: 'GABRIELA BERMÚDEZ QUIÑONES', curp: 'BEQG820116MDGRXB07', email: 'gbermudez@itdurango.edu.mx' },
    { nombreCompleto: 'GEORGE WILLIAM GUTIÉRREZ LÓPEZ', curp: '', email: 'george.gutierrez@itdurango.edu.mx' },
    { nombreCompleto: 'GEORGINA ALEJANDRA QUIÑONES NÚÑEZ', curp: 'QUNG821117MDGXXR02', email: 'georgina.quiones@itdurango.edu.mx' },
    { nombreCompleto: 'GERARDINA DE LAS MARAVILLAS GONZÁLEZ VALENCIANO', curp: 'GOVG660114MDGNLR00', email: 'gerardinagonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'GERARDO MAR PADRÓN', curp: '', email: 'gerardo.padron@itdurango.edu.mx' },
    { nombreCompleto: 'GERARDO RAFAEL ÁLVAREZ ALVARADO', curp: 'AAAG691106HDGLLR06', email: 'galvarez@itdurango.edu.mx' },
    { nombreCompleto: 'GERARDO RAFAEL SOLANO SALAZAR', curp: 'SOSG591208HDGLLR00', email: 'gsolano@itdurango.edu.mx' },
    { nombreCompleto: 'GILDA FERNÁNDEZ VÁZQUEZ', curp: 'FEVG810605MDGRZL04', email: 'gfernandez@itdurango.edu.mx' },
    { nombreCompleto: 'GILDA HERMILA MARTÍNEZ FREYRE', curp: 'MAFG590113MDGRRL01', email: 'ghmartinez@itdurango.edu.mx' },
    { nombreCompleto: 'GONZALO CORRAL JÁQUEZ', curp: 'COJG540203HDGRQN04', email: 'gcorral@itdurango.edu.mx' },
    { nombreCompleto: 'GONZALO VILLARREAL CHÁVEZ', curp: 'VICG580110HDGLHN06', email: 'gvillarreal@itdurango.edu.mx' },
    { nombreCompleto: 'GRACIELA ENRÍQUEZ FLORES', curp: 'EIFG700324MDGNLR09', email: 'graciela.enriquez@itdurango.edu.mx' },
    { nombreCompleto: 'GRACIELA HERRERA VÁZQUEZ', curp: 'HEVG640918MDGRZR06', email: 'graciela.herrera@itdurango.edu.mx' },
    { nombreCompleto: 'GREGORIO LAURO SOLÍS QUIÑONES', curp: 'SOQG480818HDGLXR03', email: 'glsolis@itdurango.edu.mx' },
    { nombreCompleto: 'GUILLERMO DE ANDA RODRÍGUEZ', curp: 'AARG711010HDGNDL06', email: 'guillermo.dr@reynosa.tecnm.mx' },
    { nombreCompleto: 'GUILLERMO FLORES DE LA HOYA', curp: 'FOHG630119HDGLYL07', email: 'gflores@itdurango.edu.mx' },
    { nombreCompleto: 'GUILLERMO GONZÁLEZ TREVIÑO', curp: '', email: 'guillermogt@itdurango.edu.mx' },
    { nombreCompleto: 'GUILLERMO ROSALES PÉREZ', curp: 'ROPG750625HCLSRL05', email: 'guillermo.rosales@itdurango.edu.mx' },
    { nombreCompleto: 'GUSTAVO FABIÁN SOLANO ROSALES', curp: 'SORG710826HDGLSS01', email: 'gustavosolano@itdurango.edu.mx' },
    { nombreCompleto: 'GUSTAVO FAUSTO DOMÍNGUEZ REYES', curp: 'DORG690501HDGMYS08', email: 'gdominguez@itdurango.edu.mx' },
    { nombreCompleto: 'GUSTAVO MORÁN ROMERO', curp: 'MORG550923HDGRMS02', email: 'gustavo.moran@itdurango.edu.mx' },
    { nombreCompleto: 'GUSTAVO MORÁN SOTO', curp: 'MOSG830923HDGRTS08', email: 'gmoran@itdurango.edu.mx' },
    { nombreCompleto: 'HARAT ISAÍ MUÑOZ BAYONA', curp: '', email: 'dep.haratbayona@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR ALONSO FILETO PÉREZ', curp: 'FIPH780404HDGLRC05', email: 'hfileto@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR ALONSO RESÉNDIZ ORTIZ', curp: 'REOH790829HDGSRC03', email: 'hresendiz@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR ANTONIO FLORES CABRAL', curp: 'FOCH800613HDGLBC05', email: 'hflores@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR GARCÍA CAMACHO', curp: 'GACH630731HDGRMC09', email: 'hgarcia@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR GERARDO RODRÍGUEZ GÁNDARA', curp: '', email: 'hector.rodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR MARTÍNEZ ARGÁIZ', curp: 'MAAH620909HSPRRC06', email: 'hmartinez@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR RAMÓN RUANO ESQUIVEL', curp: 'RUEH840716HDGNSC05', email: 'hruano@itdurango.edu.mx' },
    { nombreCompleto: 'HÉCTOR SOLÍS FLORES', curp: 'SOFH790310HDGLLC02', email: 'hsolis@itdurango.edu.mx' },
    { nombreCompleto: 'HILDA VERÓNICA GARCÍA ROJAS', curp: 'GARH820205MDGRJL02', email: 'hvgr_13@itdurango.edu.mx' },
    { nombreCompleto: 'HILDA YOLANDA AYALA CARMONA', curp: 'AACH650307MZSYRL06', email: 'hayala@itdurango.edu.mx' },
    { nombreCompleto: 'HIRAM MEDRANO ROLDÁN', curp: 'MERH440312HDGDLR08', email: 'hmedrano@itdurango.edu.mx' },
    { nombreCompleto: 'HUGO ANTONIO RÁNGEL MONTELONGO', curp: 'RAMH690317HDGNNG04', email: 'hrangel@itdurango.edu.mx' },
    { nombreCompleto: 'HUMBERTO DE LA PAZ GONZÁLEZ', curp: 'PAGH580622HDGZNM02', email: 'hde@itdurango.edu.mx' },
    { nombreCompleto: 'IBETH ZAHARAÍ LÓPEZ GÓMEZ', curp: 'LOGI870120MDGPMB03', email: 'opim@itdurango.edu.mx' },
    { nombreCompleto: 'IMELDA ARMIDA VALLES LOERA', curp: 'VALI650129MDGLRM01', email: 'ivalles@itdurango.edu.mx' },
    { nombreCompleto: 'IRMA ÁNGELICA ALARCÓN VALLE', curp: 'AAVI910416MDGLLR05', email: 'aalarcon@itdurango.edu.mx' },
    { nombreCompleto: 'IRMA SELENE HERNÁNDEZ CARRILLO', curp: 'HECI690416MDGRRR06', email: 'hselene@itdurango.edu.mx' },
    { nombreCompleto: 'ISAAC MEJÍA HERNÁNDEZ', curp: 'MEHI620721HDGJRS01', email: 'isaac.mejia@itdurango.edu.mx' },
    { nombreCompleto: 'ISAÍAS MEDINA BELTRÁN', curp: 'MEBI830521HDGDLS06', email: 'isaias.medina@itdurango.edu.mx' },
    { nombreCompleto: 'ISELA FLORES MONTENEGRO', curp: 'FOMI720201MDGLMS01', email: 'iflores@itdurango.edu.mx' },
    { nombreCompleto: 'ISIDRO AMARO RODRÍGUEZ', curp: 'AARI820406HDGMDS04', email: 'iamaro@itdurango.edu.mx' },
    { nombreCompleto: 'ISMAEL VÁZQUEZ QUIÑONES', curp: 'VAQI720411HDGZXS09', email: 'ismael.vazquez@itdurango.edu.mx' },
    { nombreCompleto: 'IVÁN GONZÁLEZ LAZALDE', curp: 'GOLI741219HDGNZV08', email: 'igonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'IVÁN SANTOS CASTRO', curp: 'SACI780831HDGNSV07', email: 'ivan.santos@itdurango.edu.mx' },
    { nombreCompleto: 'IVONNE TORRES IBARRA', curp: 'TOII830422MDGRBV01', email: 'ivonneti@itdurango.edu.mx' },
    { nombreCompleto: 'J GUADALUPE RUIZ CARRETE', curp: 'RUCG671029HDGZRD05', email: 'jruizcarrete@itdurango.edu.mx' },
    { nombreCompleto: 'JACOBO FLORES UNZUETA', curp: 'FOUJ750504HDGLNC04', email: 'jacobo.flores@itdurango.edu.mx' },
    { nombreCompleto: 'JAIME ANUAR SELEME OCAMPO', curp: 'SEOJ821019HDGLCM02', email: 'anuarseleme@itdurango.edu.mx' },
    { nombreCompleto: 'JAIME RUIZ ARELLANO', curp: 'RUAJ740525HDFZRM09', email: 'jaime.ruiz@itdurango.edu.mx' },
    { nombreCompleto: 'JAIME SÁNCHEZ CASTILLO', curp: 'SACJ470827HPLNSM02', email: 'jaimescastillo@itdurango.edu.mx' },
    { nombreCompleto: 'JANETTE AGUIRRE FILETO', curp: 'AUFJ760217MDGGLN01', email: 'janette.aguirre@itdurango.edu.mx' },
    { nombreCompleto: 'JARED RÍOS QUIÑONES', curp: 'RIQJ800715HDGSXR01', email: 'jrios@itdurango.edu.mx' },
    { nombreCompleto: 'JAVIER CALDERÓN FRANCISCO', curp: 'CAXF511027HDGLXR09', email: 'fxklderon@itdurango.edu.mx' },
    { nombreCompleto: 'JAVIER LÓPEZ MIRANDA', curp: 'LOMJ511203HMCPRV14', email: 'jlopez@itdurango.edu.mx' },
    { nombreCompleto: 'JEORGINA CALZADA TERRONES', curp: 'CATJ670423MDGLRR09', email: 'jcalzada@itdurango.edu.mx' },
    { nombreCompleto: 'JESSICA BERNARDETTE MOLINA ESCALIER', curp: 'MOEJ851021MDGLSS01', email: 'jessicamolina@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS ADRIÁN MARTÍNEZ CAMPUZANO', curp: 'MACJ801123HDGRMS07', email: 'ja_mtzc@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS BERNARDO PÁEZ LERMA', curp: 'PALJ770601HDGZRS05', email: 'jpaez@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS CELIS PORRAS', curp: 'CEPJ600409HDGLRS09', email: 'jcelis@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS ENRIQUE AYALA SANTANA', curp: 'AASJ810825HZSYNS07', email: 'jayala@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS GERARDO HERNÁNDEZ BURCIAGA', curp: '', email: 'jghernadez@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS GUADALUPE RUBIO URQUIJO', curp: 'RUUJ660511HSLBRS03', email: 'jesus.rubio@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS GUILLERMO LAZALDE MARTÍNEZ', curp: 'LAMJ811221HDGZRS05', email: 'jesus.lazalde@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS JOB REZA LUNA', curp: 'RELJ680512HDGZNS04', email: 'jesusjob.reza@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS NEFTALÍ MORONES ESQUIVEL', curp: 'MOEJ810417HDGRSS02', email: 'jmorones@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS RAMÓN GERARDO MORENO', curp: 'GEMJ590421HSLRRS03', email: 'jrgerardo@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS ROBERTO ROBLES ZAPATA', curp: 'ROZJ581127HDGBPS19', email: 'jesus.roblesz@itdurango.edu.mx' },
    { nombreCompleto: 'JESÚS RUVALCABA GONZÁLEZ', curp: 'RUGJ510925HDGVNS09', email: 'jesusruvalcaba@itdurango.edu.mx' },
    { nombreCompleto: 'JETZABEL CONDE OLGUÍN', curp: 'COOJ800206MDGNLT04', email: 'jconde@itdurango.edu.mx' },
    { nombreCompleto: 'JORGE QUIÑONES OLGUIN', curp: 'QUOJ790828MDGNRS00', email: 'jorge.quinones@itdurango.edu.mx' },
    { nombreCompleto: 'JORGE SIFUENTES DE LA HOYA', curp: 'SIHJ680205HDGFYR08', email: 'jorge.sifuentes@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ALBERTO CÓRDOVA QUIÑONES', curp: 'COQA550109HDGRXL08', email: 'jacordova@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ALBERTO GALLEGOS INFANTE', curp: 'GAIA670408HSPLNL08', email: 'agallegos@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ALEJANDRO ALE BURGOS', curp: 'AEBA600923HDGLRL03', email: 'aleburgos@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ALFREDO SERRANO SALAZAR', curp: 'SESA571217HDGRLL08', email: 'jserrano@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO DÍAZ GUTIÉRREZ', curp: 'DIGA511203HDGZTN08', email: 'diazgja@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO GUTIÉRREZ REYES', curp: 'GURA670903HDGTYN04', email: 'agutierrez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO JIMÉNEZ VELÁZQUEZ', curp: 'JIVA721003HDGMLN01', email: 'ajmz@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO MARTÍNEZ LÓPEZ', curp: 'MALA610912HDGRPN08', email: 'jantoniomtzl@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO MARTÍNEZ RIVERA', curp: 'MARA690422HDGRVN03', email: 'jamartinez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ANTONIO MEDINA AZCONA', curp: 'MEAA530831HDGDZN09', email: 'jamedina@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ARTURO PÉREZ MARTÍNEZ', curp: 'PEMA770812HDGRRR08', email: 'jose.perez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ CARLOS VARGAS ROSALES', curp: 'VARC511230HDGRSR06', email: 'cvargas@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ DE LEÓN SOTO GARCÍA', curp: 'SOGL540218HDGTRN02', email: 'leon.soto@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ DE LOS RÍOS RÍOS', curp: 'RIRJ510806HDGSSS01', email: 'jose_delosrios@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ DEMETRIO VELÁZQUEZ PIEDRA', curp: 'VEPD610520HDGLDM07', email: 'jose.velazquez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ DOMINGO POPE SOLÍS', curp: 'POSD550319HCLPLM03', email: 'jdpope@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ GABRIEL RODRÍGUEZ RIVAS', curp: 'RORG720914HDGDVB05', email: 'gabriel.rodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ GERARDO IGNACIO GÓMEZ ROMERO', curp: '', email: 'gerardo.gomez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ IGNACIO CASAS ESPINO', curp: '', email: 'i.espino@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ INOCENTE ÁLVAREZ HERRERA', curp: 'AAHI601228HDGLRN09', email: 'jose.alvarez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ LAURO SOLÍS GALLEGOS', curp: 'SOGL690904HDGLLR00', email: 'jlsolis@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ LUIS ÁLVAREZ PEÑA', curp: 'AAPL570605HDFLXS02', email: 'jlalvarezp@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ LUIS CUAUHTÉMOC GARCÍA RODRÍGUEZ', curp: 'GARL640920HDGRDS00', email: 'ktmoc@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ LUIS MARCELINO FLORES ESQUIVEL', curp: 'FOEL430109HGTLSS03', email: 'joseflores@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ MANUEL CARRILLO HERNÁNDEZ', curp: 'CAHM671104HDGRRN04', email: 'jose.carrillo@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ MANUEL MARTÍNEZ VÁZQUEZ', curp: 'MAVM790614HDGRZN09', email: 'josemartinez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ MANUEL PENSABEN ESQUIVEL', curp: 'PEEM490306HMNNSN02', email: 'mpensaben@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ MAURO DE LA BARRERA FRAYRE', curp: 'BAFM501121HDGRRR01', email: 'j.delabarrera@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ RAMÓN TORRECILLAS RODRÍGUEZ', curp: 'TORR431120HDGRDM08', email: 'rtorrecillas@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ RAMÓN VALDEZ GUTIÉRREZ', curp: 'VAGR720219HDFLTM03', email: 'jramonvaldez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ ROBERTO LÓPEZ QUIÑONES', curp: 'LOQR841213HDGPXB08', email: 'rlopez@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ SALINAS MEZA', curp: 'SAMJ820413HDGLZS03', email: 'jose.salinas@itdurango.edu.mx' },
    { nombreCompleto: 'JOSÉ TRINIDAD MARTÍNEZ REYNA', curp: 'MART550605HDGRYR03', email: 'marrj@itdurango.edu.mx' },
    { nombreCompleto: 'JOSUÉ ORTIZ MEDINA', curp: '', email: 'j.ortiz@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN ALEXANDER ANDERSON HUERTA', curp: 'AEHJ670824HDGLRN07', email: 'jalexander@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN ANTONIO ESCOBEDO CARREÓN', curp: 'EOCJ830912HDGSRN09', email: 'juan.escobedo@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN ANTONIO ROJAS CONTRERAS', curp: 'ROCJ790801HDGJNN03', email: 'jrojas@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN CARLOS NAVARRETE SOTO', curp: 'NASJ821228HDGVTN01', email: 'juan.navarrete@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN DE DIOS CASTAÑEDA CASTRELLÓN', curp: 'CACJ570515HDGSSN03', email: 'jdcastaneda@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN DE LA CRUZ LERMA MORENO', curp: '', email: 'jcruz@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN EDUARDO GONZÁLEZ MUÑOZ', curp: 'GOMJ761013HDGNXN02', email: 'juan.gonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN FRANCISCO ARELLANO RIVAS', curp: '', email: 'juan.arellano@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN GAMBOA GARCÍA', curp: 'GAGJ550302HDGMRN01', email: 'juan.gamboa@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN GAVIOTA RAMOS DOMÍNGUEZ', curp: 'RADJ820331HDGMMN03', email: 'juan.ramos@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN MANUEL HIDALGO GONZÁLEZ', curp: 'HIGJ590309HDGDNN07', email: 'jhidalgo@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN MANUEL PEÑA CONTRERAS', curp: 'PECJ480814HDGXNN09', email: 'juanmap@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN MIGUEL TORRES VALDÉS', curp: '', email: 'juan.torres@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN PABLO LERMA SÁNCHEZ', curp: 'LESJ761231HDGRNN02', email: 'juan.lerma@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN PAULO MARTÍN GARCÍA LEAL', curp: 'GALJ681105HDGRLN09', email: 'juan.garcia@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN RAMÓN CHAPARRO MERAZ', curp: 'CAMJ581219HDGHRN09', email: 'jr.chaparro@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN VANEGAS RENTERÍA', curp: 'VARJ580513HDGNNN06', email: 'jvanegas@itdurango.edu.mx' },
    { nombreCompleto: 'JUDITH ELIZABETH POPE CORTÉS', curp: 'POCJ970704MDGPRD06', email: 'judith.pope@itdurango.edu.mx' },
    { nombreCompleto: 'JULIA SABEL HERNÁNDEZ CARRILLO', curp: 'HECJ730102MDGRRL05', email: 'jshernandez@itdurango.edu.mx' },
    { nombreCompleto: 'JULIANA MORALES CASTRO', curp: 'MOCJ610418MDGRSL07', email: 'jmoralesit@itdurango.edu.mx' },
    { nombreCompleto: 'JULIO DÁMASO MEDINA PACHECO', curp: 'MEPJ721211HDGDCL09', email: 'jmedina@itdurango.edu.mx' },
    { nombreCompleto: 'KAREN DEYANIRA MALDONADO ROCHA', curp: 'MARK880601MJCLCR07', email: 'karen.maldonado@itdurango.edu.mx' },
    { nombreCompleto: 'KAREN MARLENNE HERRERA ROCHA', curp: '', email: 'kherrera@itdurango.edu.mx' },
    { nombreCompleto: 'KARLA MARÍA MARTÍNEZ GONZÁLEZ', curp: 'MAGK780618MDGRNR09', email: 'kmartinez@itdurango.edu.mx' },
    { nombreCompleto: 'KARLA VALENTINA PEÑA IBARRA', curp: '', email: 'karlap@itdurango.edu.mx' },
    { nombreCompleto: 'KARLA VIANEY ARRIETA CABRALES', curp: 'AICK790104MDGRBR09', email: 'k.arrieta@itdurango.edu.mx' },
    { nombreCompleto: 'LAURA GUADALUPE BUTZMANN ÁLVAREZ', curp: 'BUAL630307MDGTLR00', email: 'butzmannitd@itdurango.edu.mx' },
    { nombreCompleto: 'LAURA LUCRECIA VEGA MARTICORENA', curp: 'VEML760924MDGGRR09', email: 'lauravega@itdurango.edu.mx' },
    { nombreCompleto: 'LEONARDO HERNÁNDEZ CAMARGO', curp: 'HECL610421HDGRMN09', email: 'lhernandez@itdurango.edu.mx' },
    { nombreCompleto: 'LEONEL HUGO FAVILA HERRERA', curp: 'FAHL570829HDGVRN09', email: 'leonel.favila@itdurango.edu.mx' },
    { nombreCompleto: 'LEONEL SALVADOR LERMA ROJAS', curp: 'LERL500410HDGRJN09', email: 'llerma@itdurango.edu.mx' },
    { nombreCompleto: 'LEONEL VÁZQUEZ AGUIRRE', curp: 'VAAL740622HDGZGN09', email: 'leonel@itdurango.edu.mx' },
    { nombreCompleto: 'LEOPOLDO CAMPOS CARRILLO', curp: 'CACL720725HDGMRP08', email: 'leocampos@itdurango.edu.mx' },
    { nombreCompleto: 'LILIANA EGURE TOVALÍN', curp: 'EUTL781105MDGGVL02', email: 'legure@itdurango.edu.mx' },
    { nombreCompleto: 'LILIANA LARA MORALES', curp: 'LAML750726MDGRRL03', email: 'liliana.lara@itdurango.edu.mx' },
    { nombreCompleto: 'LILIANA MARGARITA MUÑOZ ESTRADA', curp: 'MUEL880801MDGXSL03', email: 'lilime@itdurango.edu.mx' },
    { nombreCompleto: 'LINDA MIRIAM SILERIO HERNÁNDEZ', curp: 'SIHL640726MNLLRN09', email: 'linda.silerio@itdurango.edu.mx' },
    { nombreCompleto: 'LIVORIO ALBA TORRES', curp: 'AATL410917HDGLRB01', email: 'livorio.alba@itdurango.edu.mx' },
    { nombreCompleto: 'LIZ MARGARITA QUINTERO ROBLES', curp: 'QURL820102MDGNBZ07', email: 'lizquintero@itdurango.edu.mx' },
    { nombreCompleto: 'LORENA DE LA BARRERA RIVAS', curp: 'BARL731027MDGRVR02', email: 'lorenadelabarrera@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ALEJANDRO RUIZ SOTO', curp: 'RUSL840107HDGZTS02', email: 'alexruiz@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ALFONSO ESPINOZA BARRERO', curp: 'EIBL500619HDGSRS07', email: 'lespinoza@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ARMANDO DE LA PEÑA ARELLANO', curp: 'PEAL631213HDGXRS03', email: 'aparellano@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ARMANDO MARTÍNEZ NÁJERA', curp: '', email: 'lmartinez@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ARMANDO QUIÑONES TINOCO', curp: 'QUTL511105HDGXNS09', email: 'armando.quiones@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS CAMPA GALINDO', curp: 'CAGL860701HDGMLS11', email: 'lcampa@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS CARLOS QUIÑONES MARTÍNEZ', curp: 'QUML830728HDGXRS08', email: 'lcquinones@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS CRISTÓBAL RAMOS CARRASCO', curp: 'RACL910906HDGMRS05', email: 'luis.ramos@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS FERNANDO GALINDO VARGAS', curp: 'GAVL800623HDGLRS03', email: 'lgalindo@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS GABRIEL MONTOYA AYÓN', curp: 'MOAL580225HDGNYS08', email: 'lmontoya@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS GUSTAVO REYES MARTÍNEZ', curp: '', email: 'luisreyes@itdurango.edu.mx' },
    { nombreCompleto: 'LUIS ROSALES PÉREZ', curp: 'ROPL691013HDGSRS03', email: 'lrosales@itdurango.edu.mx' },
    { nombreCompleto: 'LUISA EUGENIA GANDARILLA CASTRUITA', curp: 'GACL700216MDGNSS00', email: 'legandarilla@itdurango.edu.mx' },
    { nombreCompleto: 'LUZ ALEJANDRA DE ANDA NEVÁREZ', curp: '', email: 'luz.nevarez@itdurango.edu.mx' },
    { nombreCompleto: 'LUZ ARACELI OCHOA MARTÍNEZ', curp: 'OOML590415MDGCRZ09', email: 'aochoa@itdurango.edu.mx' },
    { nombreCompleto: 'LUZ ELENA GONZÁLEZ LAZALDE', curp: 'GOLL711213MDGNZZ04', email: 'luz.gonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'LUZ EUGENIA TORRECILLAS GUTIÉRREZ', curp: 'TOGL740206MDGRTZ07', email: 'luz.torrecillas@itdurango.edu.mx' },
    { nombreCompleto: 'LUZ MARÍA MEJÍA DÍAZ', curp: 'MEDL710606MDGJZZ02', email: 'luzmejia@itdurango.edu.mx' },
    { nombreCompleto: 'MA. ANTONIA CASTILLO MARRUFO', curp: 'CAMA610613MDGSRN03', email: 'mcastillom@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL AGUSTÍN PÉREZ RICÁRDEZ', curp: 'PERM630429HDFRCN04', email: 'manuel.perez@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL ALEJANDRO PACHECO CALDERÓN', curp: 'PACM840225HDGCLN03', email: 'manuel_pacheco@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL ALEJANDRO SÁNCHEZ CARROLA', curp: 'SACM810303HDGNRN02', email: 'alejandrosanchezc@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL DE JESÚS ALDRETE MARTÍNEZ', curp: 'AEMM530810HDGLRN04', email: 'manuel.aldrete@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL ROCHA FUENTES', curp: 'ROFM630628HDGCNN06', email: 'mrocha@itdurango.edu.mx' },
    { nombreCompleto: 'MANUEL VILLARREAL MARTÍNEZ', curp: 'VIMM510829HDGLRN05', email: 'mvillarrealm@itdurango.edu.mx' },
    { nombreCompleto: 'MARCELA IBARRA ALVARADO', curp: '', email: 'marcela.ibarra@itdurango.edu.mx' },
    { nombreCompleto: 'MARCO ANTONIO LÓPEZ RAMOS', curp: 'LORM670314HDGPMR00', email: 'marco.lopez@itdurango.edu.mx' },
    { nombreCompleto: 'MARCO ANTONIO RODRÍGUEZ ZÚÑIGA', curp: 'ROZM781218HDGDXR09', email: 'mrodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'MARCO ANTONIO SALAZAR LÓPEZ', curp: '', email: 'masalazar@itdurango.edu.mx' },
    { nombreCompleto: 'MARCO SANTIAGO GONZÁLEZ', curp: '', email: 'msantiago@itdurango.edu.mx' },
    { nombreCompleto: 'MARGARITA CARRILLO ARMSTRONG', curp: 'CAAM690624MDGRRR02', email: 'margarita.armstrong@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA ADRIANA MARTÍNEZ PRADO', curp: 'MAPA590912MDGRRD00', email: 'adriana.martinezprado@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA CRISTINA VÁZQUEZ OLVERA', curp: 'VAOC790526MDGZLR09', email: 'mvazquez@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DE LA LUZ TORRES VALLES', curp: 'TOVL610520MDGRLZ01', email: 'maria.torres@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DE LOS ÁNGELES RODRÍGUEZ ÁNGEL', curp: 'ROAA541002MDGDNN00', email: 'leo.rodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DE LOURDES GUERRERO SIMENTAL', curp: 'GUSL590205MDGRMR07', email: 'marial.guerrero@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DE LOURDES VALDEZ HERNÁNDEZ', curp: 'VAHL840923MDGLRR03', email: 'mvaldez@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DEL PILAR COVARRUBIAS RAMÍREZ', curp: 'CORP610323MDGVML00', email: 'pcovarrubias@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DEL PILAR REYES SIERRA', curp: 'RESP580322MDGYRL06', email: 'mariapilareyes@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DEL RAYO ZAMORA LERMA', curp: '', email: 'mrlerma@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA DOLORES JOSEFINA RODRÍGUEZ ROSALES', curp: 'RORD580328MDGDSL02', email: 'mdjoserr@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA ESTHER HERNÁNDEZ ESPINO', curp: '', email: 'esther.hernandez@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA FERNANDA SOLANO BARRAZA', curp: '', email: 'mfsolano@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA GUADALUPE CARRILLO HERRERA', curp: 'CAHG800508MDGRRD09', email: 'mgcarrillo@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA INÉS GUERRA ROSAS', curp: '', email: 'm.guerra@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA ISABEL PORRAS SANDOVAL', curp: 'POSI770914MDGRNS07', email: 'isabel.porras@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA LOURDES DEL CARMEN GRACIA FAVELA', curp: 'GAFL500208MDGRVR08', email: 'maria.gracia@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA LUISA ORTIZ PARGA', curp: 'OIPL700925MDGRRS09', email: 'malop@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA NINFA CABADA CARRERA', curp: 'CACN581119MDGBRN03', email: 'maria.cabadac@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA QUETZALCIHUATL GALVÁN ISMAEL', curp: 'GAIQ750122MDGLST03', email: 'qgalvan@itdurango.edu.mx' },
    { nombreCompleto: 'MARÍA TOMASA GALLEGOS SALAS', curp: 'GAST680913MDGLLM06', email: 'mgallegos@itdurango.edu.mx' },
    { nombreCompleto: 'MARICELA GUERRA FRANCO', curp: 'GUFM670902MDGRRR04', email: 'maricela.guerra@itdurango.edu.mx' },
    { nombreCompleto: 'MARICELA MÓJICA VARGAS', curp: 'MOVM640402MDGJRR05', email: 'maricelamojica@itdurango.edu.mx' },
    { nombreCompleto: 'MARICELA VELÁZQUEZ PEÑA', curp: 'VEPM730625MDGLXR04', email: 'maricela.velazquez@itdurango.edu.mx' },
    { nombreCompleto: 'MARIO ALBERTO LÓPEZ GURROLA', curp: 'LOGM700408HDGPRR08', email: 'mariolopez@itdurango.edu.mx' },
    { nombreCompleto: 'MARIO GABRIEL ZAMORA LERMA', curp: 'ZALM550119HDGMRR00', email: 'mzamora@itdurango.edu.mx' },
    { nombreCompleto: 'MARIO GERARDO HERNÁNDEZ MARINES', curp: 'HEMM600419HDGRRR06', email: 'mghernandez@itdurango.edu.mx' },
    { nombreCompleto: 'MARIO VALDERRAMA VELA', curp: 'VAVM540321HDGLLR02', email: 'mario.valderrama@itdurango.edu.mx' },
    { nombreCompleto: 'MARTHA ANGÉLICA CORDERO TRISTÁN', curp: 'COTM750825MDGRRR04', email: 'marthacordero@itdurango.edu.mx' },
    { nombreCompleto: 'MARTHA PATRICIA SORIA LEAÑOS', curp: 'SOLM730502MDGRXR04', email: 'mpsoria@itdurango.edu.mx' },
    { nombreCompleto: 'MARTHA ROCÍO MORENO JIMÉNEZ', curp: 'MOJM800429MDGRMR03', email: 'mrmoreno@itdurango.edu.mx' },
    { nombreCompleto: 'MARTÍN ÁVILA OROZCO', curp: 'AIOM511112HCHVRR02', email: 'avilao.martin@itdurango.edu.mx' },
    { nombreCompleto: 'MARTÍN CORRAL ARROYO', curp: 'COAM650101HDGRRR01', email: 'martin.corral@itdurango.edu.mx' },
    { nombreCompleto: 'MARTÍN GUSTAVO LEYVA ALANÍS', curp: 'LEAM710609HDGYLR00', email: 'mleyva@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR MARTÍN MARTÍNEZ', curp: '', email: 'oscarmartin@itdurango.edu.mx' },
    { nombreCompleto: 'MAYELA DEL RAYO LECHUGA NEVÁREZ', curp: 'LENM680106MDGCVY07', email: 'mlechuga@itdurango.edu.mx' },
    { nombreCompleto: 'MAYELA YORYET CABRAL GUERRERO', curp: '', email: 'mayela.cabral@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL AGUILAR ARAGÓN', curp: 'AUAM710315HDGGRG01', email: 'miguel.angel@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL ÁVILA GASCA', curp: 'AIGM590522HDGVSG01', email: 'mavila@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL GALLEGOS SIFUENTES', curp: 'GASM750901HDGLFG01', email: 'miguel.gallegos@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL HERNÁNDEZ SAUCEDO', curp: 'HESM640611HDGRCG02', email: 'mhernandez@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL ORNELAS VÁZQUEZ', curp: 'OEVM590930HDGRZG09', email: 'mornelas@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL RUTEAGA MARTÍNEZ', curp: 'RUMM581122HDGTRG09', email: 'rumtzcivil@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL SALAZAR LOZANO', curp: 'SALM601009HDGLZG05', email: 'miguel.salazar@itdurango.edu.mx' },
    { nombreCompleto: 'MIGUEL ÁNGEL SEGOVIA SOTO', curp: 'SESM530108HDGGTG03', email: 'masegovia@itdurango.edu.mx' },
    { nombreCompleto: 'MÓNICA ROSALES PÉREZ', curp: 'ROPM710524MDGSRN04', email: 'mrosales@itdurango.edu.mx' },
    { nombreCompleto: 'MYRNA GUADALUPE CARDOZA MARTÍNEZ', curp: 'CAMM851023MDGRRY06', email: 'mcardoza@itdurango.edu.mx' },
    { nombreCompleto: 'NATALLI CAROLINA SALAZAR FIERRO', curp: 'SAFN930907MDGLRT06', email: 'natalli.salazar@itdurango.edu.mx' },
    { nombreCompleto: 'NELLIE CECILIA SALAZAR CANO', curp: 'SACN790704MDGLNL00', email: 'nelliesalazar@itdurango.edu.mx' },
    { nombreCompleto: 'NICOLÁS ÓSCAR SOTO CRUZ', curp: 'SOCN671209HHGTRC07', email: 'nsoto@itdurango.edu.mx' },
    { nombreCompleto: 'NILTZA IRACEMA GONZÁLEZ GARCÍA', curp: 'GOGN800827MDGNRL00', email: 'iracema.gonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'NOEL RODRÍGUEZ ARÍSTEGUI', curp: 'ROAN570719HDGDRL04', email: 'no57elitd@itdurango.edu.mx' },
    { nombreCompleto: 'NOEL RODRÍGUEZ MARTÍNEZ', curp: 'ROMN930629HDGDRL09', email: 'noel.rodriguez@itdurango.edu.mx' },
    { nombreCompleto: 'NORMA ALICIA GARCÍA VIDAÑA', curp: 'GAVN721218MDGRDR06', email: 'norma.garcia@itdurango.edu.mx' },
    { nombreCompleto: 'NORMA PATRICIA SARMIENTO ACOSTA', curp: 'SAAN830607MDGRCR08', email: 'norma.sarmiento@itdurango.edu.mx' },
    { nombreCompleto: 'NURIA ELIZABETH ROCHA GUZMÁN', curp: 'ROGN690228MDGCZR04', email: 'cei@itdurango.edu.mx' },
    { nombreCompleto: 'OBED ANTONIO GARCÍA CANO', curp: 'GACO821016HDGRNB03', email: 'obedgarciac@itdurango.edu.mx' },
    { nombreCompleto: 'OCTAVIO SERGIO MARTÍNEZ REYES', curp: 'MARO600915HDGRYC04', email: 'omartinez@itdurango.edu.mx' },
    { nombreCompleto: 'OLGA MIRIAM RUTIAGA QUIÑONES', curp: 'RUQO750216MDGTXL01', email: 'omrutiaga@itdurango.edu.mx' },
    { nombreCompleto: 'OLIVIA GARCÍA LÓPEZ', curp: 'GALO670519MDGRPL00', email: 'ogarcia@itdurango.edu.mx' },
    { nombreCompleto: 'OMAR CASTAÑEDA ORTIZ', curp: 'CAOO850504HDGSRM05', email: 'ocastaneda@itdurango.edu.mx' },
    { nombreCompleto: 'OMAR OSVALDO RENTERÍA RAMOS', curp: 'RERO801217HDGNMM04', email: 'omar.renteria@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR ALFREDO LARA RODRÍGUEZ', curp: 'LARO510112HDGRDS05', email: 'oalara@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR FERNANDO PORRAS ORTIZ', curp: 'POOO630525HDGRRS07', email: 'oporras@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR GERARDO SOTO GARCÍA', curp: 'SOGO561114HDGTRS03', email: 'oscargsotog@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR HERNÁNDEZ NEVÁREZ', curp: 'HENO550928HDGRVS09', email: 'ohernandez@itdurango.edu.mx' },
    { nombreCompleto: 'OSCAR MARTÍN MARTÍNEZ', curp: 'MAXO700318HDGRXS06', email: 'oscarmartin@itdurango.edu.mx' },
    { nombreCompleto: 'ÓSCAR OMAR RÍOS JIMÉNEZ', curp: 'RIJO811231HDGSMS00', email: 'oriosj@itdurango.edu.mx' },
    { nombreCompleto: 'OSWALDO RAMÓN RODRÍGUEZ AYALA', curp: '', email: 'oswaldoayala@itdurango.edu.mx' },
    { nombreCompleto: 'OTILIA ISABEL DIAZLEAL ORNELAS', curp: 'DIOO601213MCHZRT14', email: 'otilia.diazleal@itdurango.edu.mx' },
    { nombreCompleto: 'PAOLA ELVIRA MEDRANO ÁVILA', curp: 'MEAP800113MDGDVL07', email: 'paola.medrano@itdurango.edu.mx' },
    { nombreCompleto: 'PAULINA ELIZABETH SOSA ORONA', curp: 'SOOP870611MDGSRL02', email: 'paulinasosa@itdurango.edu.mx' },
    { nombreCompleto: 'PAULINA VALLES LOERA', curp: '', email: 'pvalles@itdurango.edu.mx' },
    { nombreCompleto: 'PEDRO ANTONIO VELÁZQUEZ VENTURA', curp: 'VEVP630228HDGLND08', email: 'pvelazquez@itdurango.edu.mx' },
    { nombreCompleto: 'PEDRO LUIS LERMA GARCÍA', curp: 'LEGP771020HDGRRD03', email: 'pedro.lerma@itdurango.edu.mx' },
    { nombreCompleto: 'PERLA GUADALUPE VÁZQUEZ ORTEGA', curp: '', email: 'pvazquez@itdurango.edu.mx' },
    { nombreCompleto: 'RAFAEL ALEJANDRO VALLES GUERECA', curp: 'VAGR781006HDGLRF05', email: 'rvalles@itdurango.edu.mx' },
    { nombreCompleto: 'RAFAEL MARTÍNEZ SAAVEDRA', curp: 'MASR680413HDGRVF05', email: 'ramasa@itdurango.edu.mx' },
    { nombreCompleto: 'RAMIRO ESCAJEDA ARCE', curp: 'EAAR610309HDGSRM01', email: 'rescajeda@itdurango.edu.mx' },
    { nombreCompleto: 'RAMÓN ELEAZAR ÁVALOS LIRA', curp: 'AALR510222HDGVRM00', email: 'ramon.avalos@itdurango.edu.mx' },
    { nombreCompleto: 'RAÚL AMADOR VÁZQUEZ', curp: 'AAVR820603HDGMZL15', email: 'raul.amador@itdurango.edu.mx' },
    { nombreCompleto: 'RAÚL NAVAR SAUCEDO', curp: 'NASR621021HTSVCL00', email: 'raul.navar@itdurango.edu.mx' },
    { nombreCompleto: 'RAÚL VELÁZQUEZ VENTURA', curp: 'VEVR580114HDGLNL00', email: 'raul.ventura@itdurango.edu.mx' },
    { nombreCompleto: 'REBECA BRECEDA GONZÁLEZ', curp: 'BEGR600705MDGRNB04', email: 'rebecabreceda@itdurango.edu.mx' },
    { nombreCompleto: 'REBECA IDALY RINCÓN MONTERO', curp: 'RIMR771118MDGNNB01', email: 'rrincon@itdurango.edu.mx' },
    { nombreCompleto: 'REFUGIO DEL PILAR ALMAGUER DÍAZ', curp: 'AADR691109MDGLZF00', email: 'pilaralmaguer@itdurango.edu.mx' },
    { nombreCompleto: 'REFUGIO MUÑOZ RÍOS', curp: 'MURR580216HDGXSF05', email: 'rmrios@itdurango.edu.mx' },
    { nombreCompleto: 'RENATO ARTURO GODOY MÓJICA', curp: '', email: 'renato.godoy@itdurango.edu.mx' },
    { nombreCompleto: 'RENÉ MANUEL DE LA TORRE BURGOS', curp: 'TOBR980921HDGRRN07', email: 'mdelatorre@itdurango.edu.mx' },
    { nombreCompleto: 'RICARDO CABRERA MARTÍNEZ', curp: 'CAMR760410HTCBRC01', email: 'ricardo.cabrera@itdurango.edu.mx' },
    { nombreCompleto: 'ROBERTO ARAGÓN SANABRIA', curp: 'AASR480513HDGRNB06', email: 'roberto.aragon@itdurango.edu.mx' },
    { nombreCompleto: 'ROBERTO ARELLANO RIVAS', curp: 'AERR550707HDGRVB05', email: 'roberto.arellano@itdurango.edu.mx' },
    { nombreCompleto: 'ROBERTO ROJERO JIMÉNEZ', curp: 'ROJR800122HDGJMB07', email: 'rrojero@itdurango.edu.mx' },
    { nombreCompleto: 'ROCÍO MARGARITA LÓPEZ TORRES', curp: 'LOTR741021MDGPRC05', email: 'rmlopez@itdurango.edu.mx' },
    { nombreCompleto: 'ROCÍO VALADEZ ACOSTA', curp: 'VAAR680114MDGLCC07', email: 'rvaladez@itdurango.edu.mx' },
    { nombreCompleto: 'ROCÍO VALLES ROSALES', curp: 'VARR671031MDGLSC00', email: 'rocio.valles@itdurango.edu.mx' },
    { nombreCompleto: 'RODRIGO GERARDO QUEVEDO HERNÁNDEZ', curp: 'QUHR740717HDGVRD01', email: 'gquevedo@itdurango.edu.mx' },
    { nombreCompleto: 'ROSA ELVA RODARTE LÓPEZ', curp: '', email: 'rosa.rodarte@itdurango.edu.mx' },
    { nombreCompleto: 'ROSALÍA CARDONA GARCÍA', curp: 'CAGR570924MDFRRS06', email: 'rcardona@itdurango.edu.mx' },
    { nombreCompleto: 'ROSENDA PEYRO VALLES', curp: 'PEVR670808MDGYLS08', email: 'rosenda.peyro@itdurango.edu.mx' },
    { nombreCompleto: 'ROSSANA FAVIOLA ZÚÑIGA MERAZ', curp: 'ZUMR741118MDGXRS06', email: 'fzuniga@itdurango.edu.mx' },
    { nombreCompleto: 'RUBÉN BRETADO AGUIRRE', curp: 'BEAR531118HDGRGB00', email: 'rbretado@itdurango.edu.mx' },
    { nombreCompleto: 'RUBÉN FRANCISCO GONZÁLEZ LAREDO', curp: 'GOLR560415HDGNRB01', email: 'rubenfgl@itdurango.edu.mx' },
    { nombreCompleto: 'RUBÉN GUERRERO RIVERA', curp: 'GURR710508HDGRVB05', email: 'rubenfgl@itdurango.edu.mx' },
    { nombreCompleto: 'RUBÉN PIZARRO GURROLA', curp: 'PIGR691106HDGZRB04', email: 'rpizarro@itdurango.edu.mx' },
    { nombreCompleto: 'RUBÉN ROSALES DÍAZ', curp: 'RODR500124HDGSZB01', email: 'rrosales@itdurango.edu.mx' },
    { nombreCompleto: 'SALVADOR DAVIS RODRÍGUEZ', curp: 'DARS540510HDGVDL08', email: 'sal_davisr@itdurango.edu.mx' },
    { nombreCompleto: 'SALVADOR RAMOS COLLINS', curp: 'RACS580111HDGMLL05', email: 'sal_davisr@itdurango.edu.mx' },
    { nombreCompleto: 'SAMUEL DE LA LUZ RIVERA SANTILLÁN', curp: 'RISS650602HDGVNM07', email: 'samuel.rivera@itdurango.edu.mx' },
    { nombreCompleto: 'SANDRA GABRIELA SALAZAR BUTZMANN', curp: 'SABS860731MDGLTN12', email: 'sandrasalazar@itdurango.edu.mx' },
    { nombreCompleto: 'SANDRA NALLELY RUEDA GÓMEZ', curp: 'RUGS900213MDGDMN08', email: 'sandrarueda@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO BURGOS FUENTES', curp: 'BUFS530418HDGRNR06', email: 'sergio.burgos@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO BUSTAMANTE ALVARADO', curp: 'NUAS591123HDGSLR07', email: 'sbustamante@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO GUSTAVO BERMÚDEZ ALANÍS', curp: 'BEAS500514HDGRLR07', email: 'sbemudeza@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO PARRA DÍAZ', curp: 'PADS630416HDGRZR07', email: 'sparra@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO SALAZAR LÓPEZ', curp: 'SALS580711HDGLPR01', email: 'chicho58@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO VALDEZ GURROLA', curp: 'VAGS460320HDGLRR02', email: 'svaldezg@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO VALDEZ HERNÁNDEZ', curp: 'VAHS711129HDGLRR08', email: 'svaldez@itdurango.edu.mx' },
    { nombreCompleto: 'SERGIO VALLE CERVANTES', curp: 'VACS571007HCLLRR04', email: 'svalle@itdurango.edu.mx' },
    { nombreCompleto: 'SILVIA MARINA GONZÁLEZ HERRERA', curp: 'GOHS560113MDGNRL01', email: 'sgonzalez@itdurango.edu.mx' },
    { nombreCompleto: 'SONIA LORENA SICSIK ARÉVALO', curp: 'SIAS711010MDGCRN00', email: 'sonia.sicsik@itdurango.edu.mx' },
    { nombreCompleto: 'SUSANA CRISTINA ROSALES AGUILERA', curp: 'ROAS630312MDGSGS03', email: 'srosales@itdurango.edu.mx' },
    { nombreCompleto: 'SUSANA ELIZABETH MONTES MARRERO', curp: '', email: 'smontes@itdurango.edu.mx' },
    { nombreCompleto: 'TANIA EDITH MARTÍNEZ BAYONA', curp: 'MABT790806MDGRYN09', email: 'tmartinez@itdurango.edu.mx' },
    { nombreCompleto: 'TANIA ELENA LOZANO MUÑOZ', curp: 'LOMT830128MDGZXN03', email: 'tania.lozano@itdurango.edu.mx' },
    { nombreCompleto: 'TANIA MONTOYA GARCÍA', curp: 'MOGT761227MDGNRN01', email: 'tania.montoya@itdurango.edu.mx' },
    { nombreCompleto: 'TOMÁS REYES OJEDA', curp: 'REOT701223HDGYJM09', email: 'treyes@itdurango.edu.mx' },
    { nombreCompleto: 'VALENTÍN ARAGÓN RAFAEL', curp: 'AAXR680214HDGRXF14', email: 'rafaelaragon@itdurango.edu.mx' },
    { nombreCompleto: 'VERÓNICA CERVANTES CARDOZA', curp: 'CECV790831MDGRRR03', email: 'veronica.cervantes@itdurango.edu.mx' },
    { nombreCompleto: 'VERÓNICA ROMO VIGGERS', curp: 'ROVV661006MDGMGR00', email: 'vrviggers@itdurango.edu.mx' },
    { nombreCompleto: 'VIANEY VELÁZQUEZ LUNA', curp: '', email: 'vvelazquez@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR CAMPA MENDOZA', curp: 'CAMV420728HDGMNC00', email: 'vcampa@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR HUGO DE LA HOYA DUARTE', curp: 'HODV810703HDGYRC06', email: 'vdelahoya@itdurango.edu.mx' },
    { nombreCompleto: 'VICTOR JESÚS MARTÍNEZ GÓMEZ', curp: '', email: 'victor.martinez@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR MANUEL CANALES SAUCEDO', curp: 'CASV661230HSRNCC08', email: 'victor.canales@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR MANUEL DERAS SANDOVAL', curp: 'DESV540323HDGRNC01', email: 'victorderas@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR MANUEL FÁBILA HERNÁNDEZ', curp: 'FAHV620107HDFBRC04', email: 'fabilav@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR MANUEL REVELES CASTAÑEDA', curp: '', email: 'victor.reveles@itdurango.edu.mx' },
    { nombreCompleto: 'VÍCTOR MANUEL RIVERA SÁNCHEZ', curp: 'RISV730513HDGVNC06', email: 'vrivera@itdurango.edu.mx' },
    { nombreCompleto: 'VIRNA DENICE MENA GONZÁLEZ', curp: 'MEGV740316MDGNNR09', email: 'virnamena@itdurango.edu.mx' },
    { nombreCompleto: 'WALFRED ROSAS FLORES', curp: 'ROFW821103HMSSLL02', email: 'wrosas@itdurango.edu.mx' },
    { nombreCompleto: 'YOLOCUAUHTLI SALAZAR MUÑOZ', curp: 'SAMY780202MDGLXL02', email: 'ysalazar@itdurango.edu.mx' },
    { nombreCompleto: 'YUREXIA DEL ÁNGEL SALAZAR', curp: 'AESY860814MDGNLR03', email: 'yurexia.angel@itdurango.edu.mx' },
    { nombreCompleto: 'ZAYDA MABEL VALENZUELA MENA', curp: 'VAMZ800108MDGLNY02', email: 'zmvalenzuela@itdurango.edu.mx' }
];

const mockCourses: Course[] = [
    { id: 'TNM-054-01-2026', name: 'CONOCIENDO REGLAMENTOS Y LINEAMIENTOS; UNA PAUTA PARA EL DESARROLLO DOCENTE Y PERFIL DESEABLE', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'A4', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-02-2026', name: 'PYTHON BÁSICO', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Edifcio O', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-03-2026', name: 'MANTENIMIENTO CORRECTIVO FRESA CNC DYNA MYTE', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Lab. de Electrica', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-04-2026', name: 'HERRAMIENTAS DE INTELIGENCIA ARTIFICIAL GENERATIVA', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Lab. de Elen', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-05-2026', name: 'METODOLOGÍA DE EDUCACIÓN VIRTUAL - ITDED', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Centro de Información Sala A', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-06-2026', name: 'BÚSQUEDA Y RESCATE', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'UPIDET', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-07-2026', name: 'ESTANDARIZACIÓN DE LOS CURSOS DE LA PLATAFORMA MOODLE DE LA ACADEMIA DE INFORMÁTICA', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Centro de Innovación', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-08-2026', name: 'TALLER DE CONSTRUCCIÓN', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Ed. Quimica-Bioqumica', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-09-2026', name: 'MARCO DE REFERENCIA CACEI 2025, PARA LA ACREDITACIÓN DE INGENIERÍA QUÍMICA PARTE I', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Lab. de Alimentos Funcionales', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-10-2026', name: 'MANEJO DE TORNO', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'A2', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-11-2026', name: 'INGLES BÁSICO', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'O1', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-12-2026', name: 'ACTUALIZACIÓN INTEGRADA DE PRÁCTICAS DE LABORATORIO', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'T1', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-13-2026', name: 'TALLER PARA AUDITABLES; DIRIGIDO A ALTA DIRECCIÓN Y JEFES DE DEPARTAMENTO', dates: 'DEL 13 AL 17 DE ENERO DEL 2026', period: 'PERIODO_1', hours: 30, location: 'Ed. Sistema y Computacion', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-14-2026', name: 'HERRAMIENTAS DE INTELIGENCIA ARTIFICIAL GENERATIVA CAPITULO 2', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Lab. de Computo', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-15-2026', name: 'ANÁLISIS DE LA RETÍCULA DE LAS CARRERAS DE SISTEMAS Y COMPUTACIÓN', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Hemeroteca', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-16-2026', name: 'NUTRICIÓN PARA LA PREVENCIÓN DEL SÍNDROME METABÓLICO', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'A4', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-17-2026', name: 'METODOLOGÍA DE EDUCACIÓN VIRTUAL - ITDED I', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Edifcio O', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-18-2026', name: 'INTRODUCCIÓN BIM REVIT ARQUITECTURA', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Lab. de Electrica', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-19-2026', name: 'ESTRATEGIAS PARA EL DESARROLLO Y MEJORA DEL LABORATORIO DE INGENIERÍA CIVIL', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Lab. de Elen', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-20-2026', name: 'MARCO DE REFERENCIA CACEI 2025; PARA LA ACREDITACIÓN DE INGENIERÍA QUÍMICA PARTE II', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Centro de Información Sala A', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-21-2026', name: 'DISEÑO DE PROCESOS TÉRMICOS EN ALIMENTOS DE BAJA ACIDEZ', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'UPIDET', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-22-2026', name: 'INGLES BÁSICO I', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Centro de Innovación', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-23-2026', name: 'DISEÑO DE PLANES DE FORMACIÓN DUAL', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Ed. Quimica-Bioqumica', schedule: '9:00 a 15:00 hrs', type: 'Docente' },
    { id: 'TNM-054-24-2026', name: 'HERRAMIENTAS Y ESTRATEGIAS PARA EL ACOMPAÑAMIENTO ACADÉMICO EN INGENIERÍA MECÁNICA Y MECATRÓNICA', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'Lab. de Alimentos Funcionales', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-25-2026', name: 'ANÁLISIS DE CIRCUITOS CON SIMULINK', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'A2', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-26-2026', name: 'ANÁLISIS ESTADÍSTICO DE DATOS', dates: 'DEL 20 AL 24 DE ENERO DEL 2026', period: 'PERIODO_2', hours: 30, location: 'O1', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-27-2026', name: 'CONFIGURACIÓN DE TARJETA JETSON NANO ORIN PARA EL DESARROLLO DE APLICACIONES DEEP LEARNING CONVOLUCIONAL', dates: 'DEL 20 AL 24 DE ENERO DEL 2025', period: 'PERIODO_2', hours: 30, location: 'T1', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-28-2026', name: 'ANÁLISIS DE SISTEMAS TÉRMICOS MEDIANTE SOFTWARE ESPECIALIZADO', dates: 'DEL 20 AL 24 DE ENERO DEL 2025', period: 'PERIODO_2', hours: 30, location: 'Ed. Sistema y Computacion', schedule: '9:00 a 15:00 hrs', type: 'Profesional' },
    { id: 'TNM-054-29-2026', name: 'TALLER DE IMPLEMENTACIÓN DE PRÁCTICAS DEL EQUIPO LUCAS-NULLE', dates: 'DEL 20 AL 24 DE ENERO DEL 2025', period: 'PERIODO_2', hours: 30, location: 'Lab. de Computo', schedule: '9:00 a 15:00 hrs', type: 'Profesional' }
];

const mockDepartments: string[] = [
    "DEPARTAMENTO DE SISTEMAS Y COMPUTACION",
    "DEPARTAMENTO DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA",
    "DEPARTAMENTO DE CIENCIAS ECONOMICO-ADMINISTRATIVAS",
    "DEPARTAMENTO DE INGENIERÍA QUÍMICA-BIOQUÍMICA",
    "DEPARTAMENTO DE CIENCIAS DE LA TIERRA",
    "DEPARTAMENTO DE CIENCIAS BASICAS",
    "DEPARTAMENTO DE METAL-MECÁNICA",
    "DEPARTAMENTO DE INGENIERÍA INDUSTRIAL",
    "DIVISION DE ESTUDIOS DE POSGRADO E INVESTIGACION",
    "ADMINISTRATIVO",
    "EXTERNO"
];

const getTeachers = (): Promise<Teacher[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockTeachers), 500));
};

const getCourses = (): Promise<Course[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockCourses), 500));
};

const getDepartments = (): Promise<string[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDepartments), 500));
};

const submitRegistration = (submission: SubmissionData): Promise<RegistrationResult[]> => {
    console.log("Submitting registration:", submission);
    
    const results: RegistrationResult[] = submission.selectedCourses.map((course, index) => ({
        courseName: course.name,
        registrationId: `${course.id}-${Math.floor(Math.random() * 30) + 1}`
    }));

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Submission successful, returning results:", results);
            resolve(results);
        }, 1500);
    });
};

// =============================================================================
// == COMPONENTS
// =============================================================================

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    <div className="flex-shrink-0">
                        <img className="h-16 md:h-20" src="https://raw.githubusercontent.com/DA-itd/web/main/logo_itdurango.png" alt="Logo Instituto Tecnológico de Durango" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl md:text-2xl font-bold text-blue-900">SISTEMA DE INSCRIPCIÓN A CURSOS DE ACTUALIZACIÓN DOCENTE</h1>
                        <h2 className="text-md md:text-lg text-blue-900">INSTITUTO TECNOLÓGICO DE DURANGO</h2>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-800 text-white text-center p-4 mt-auto">
            <p className="font-semibold">COORDINACIÓN DE ACTUALIZACIÓN DOCENTE - Desarrollo Académico</p>
            <p className="text-sm">Todos los derechos reservados 2026.</p>
        </footer>
    );
};

interface StepperProps {
    currentStep: number;
    steps: string[];
}
const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep - 1;

                    return (
                        <Fragment key={index}>
                            <div className="flex flex-col items-center w-1/4">
                                <div className="relative flex items-center justify-center">
                                    <div className={`w-10 h-10 flex items-center justify-center z-10 rounded-full font-semibold text-white ${isCompleted ? 'bg-rose-800' : 'bg-gray-300'} ${isActive && 'ring-4 ring-rose-300'}`}>
                                        {index + 1}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`absolute w-full top-1/2 -translate-y-1/2 left-1/2 h-1 ${index < currentStep -1 ? 'bg-rose-800' : 'bg-gray-300'}`} />
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={`text-sm font-medium ${isCompleted ? 'text-rose-800' : 'text-gray-500'}`}>
                                        {step}
                                    </p>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

interface AutocompleteProps {
    teachers: Teacher[];
    onSelect: (teacher: Teacher) => void;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    placeholder?: string;
}

const AutocompleteInput: React.FC<AutocompleteProps> = ({ teachers, onSelect, value, onChange, name, placeholder }) => {
    const [suggestions, setSuggestions] = useState<Teacher[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        onChange(e); // Propagate change to parent immediately

        if (currentValue && currentValue.length > 0) {
            const filtered = teachers.filter(teacher =>
                teacher.nombreCompleto.toLowerCase().includes(currentValue.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (teacher: Teacher) => {
        onSelect(teacher);
        setShowSuggestions(false);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        if (currentValue && currentValue.length > 0) {
            const filtered = teachers.filter(teacher =>
                teacher.nombreCompleto.toLowerCase().includes(currentValue.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        }
    }

    return (
        <div className="relative" ref={containerRef}>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder={placeholder || "Escriba su nombre completo"}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {suggestions.map((teacher) => (
                        <li
                            key={teacher.curp || teacher.nombreCompleto}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input from losing focus
                                handleSelect(teacher);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {teacher.nombreCompleto}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface Step1Props {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    departments: string[];
    teachers: Teacher[];
    onNext: () => void;
}

const Step1PersonalInfo: React.FC<Step1Props> = ({ formData, setFormData, departments, teachers, onNext }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = "Este campo es obligatorio.";
        if (!formData.curp) newErrors.curp = "Este campo es obligatorio.";
        if (formData.curp.length < 18) newErrors.curp = "El CURP debe tener 18 caracteres.";
        if (!formData.email) newErrors.email = "Este campo es obligatorio.";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "El formato del email no es válido.";
        if (!formData.department) newErrors.department = "Este campo es obligatorio.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'email') {
            finalValue = value.toLowerCase();
        } else if (name === 'curp' || name === 'fullName') {
            finalValue = value.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleTeacherSelect = (teacher: Teacher) => {
        const { nombreCompleto, curp, email } = teacher;
        setFormData(prev => ({
            ...prev,
            fullName: (nombreCompleto || '').toUpperCase(),
            curp: curp || '',
            email: email || '',
        }));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Información Personal</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                        <AutocompleteInput 
                            teachers={teachers} 
                            onSelect={handleTeacherSelect} 
                            value={formData.fullName}
                            onChange={handleChange}
                            name="fullName"
                            placeholder="Escriba su nombre completo"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label htmlFor="curp" className="block text-sm font-medium text-gray-700">CURP *</label>
                        <input type="text" name="curp" id="curp" value={formData.curp} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="18 caracteres" maxLength={18} required />
                        {errors.curp && <p className="text-red-500 text-xs mt-1">{errors.curp}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Institucional *</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="nombre@itdurango.edu.mx" required />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género *</label>
                        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
                            <option>Mujer</option>
                            <option>Hombre</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento *</label>
                        <select name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
                            <option value="">Seleccione un departamento</option>
                            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-700">Continuar</button>
                </div>
            </form>
        </div>
    );
};

interface Step2Props {
    courses: Course[];
    selectedCourses: Course[];
    setSelectedCourses: (courses: Course[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step2CourseSelection: React.FC<Step2Props> = ({ courses, selectedCourses, setSelectedCourses, onNext, onBack }) => {
    const [error, setError] = useState<string | null>(null);

    const handleSelectCourse = (course: Course) => {
        const isSelected = selectedCourses.some(c => c.id === course.id);
        let newSelection = [...selectedCourses];
        setError(null); // Clear previous errors on a new action

        if (isSelected) {
            newSelection = newSelection.filter(c => c.id !== course.id);
        } else {
            // Check for max courses
            if (selectedCourses.length >= 3) {
                setError("No puede seleccionar más de 3 cursos.");
                return;
            }
            // Check for period conflict
            const hasPeriodConflict = selectedCourses.some(c => c.period === course.period);
            if (hasPeriodConflict) {
                setError("Ya ha seleccionado un curso para este periodo.");
                return;
            }
            // Check for time conflict
            const hasTimeConflict = selectedCourses.some(selected => {
                const selectedTimes = selected.schedule.split(' a ').map(t => parseInt(t.replace(':', '')));
                const courseTimes = course.schedule.split(' a ').map(t => parseInt(t.replace(':', '')));
                return selected.dates === course.dates && Math.max(selectedTimes[0], courseTimes[0]) < Math.min(selectedTimes[1], courseTimes[1]);
            });
            if (hasTimeConflict) {
                setError("El horario de este curso se solapa con otro curso seleccionado.");
                return;
            }
            newSelection.push(course);
        }
        
        setSelectedCourses(newSelection);
    };
    
    const getCourseCardClass = (course: Course) => {
        const hasPeriodConflict = selectedCourses.some(c => c.period === course.period && c.id !== course.id);
        const isSelected = selectedCourses.some(c => c.id === course.id);

        if (isSelected) {
            return `ring-2 ring-offset-2 ${course.period === 'PERIODO_1' ? 'ring-teal-500' : 'ring-indigo-500'}`;
        }
        if (hasPeriodConflict) {
            return "opacity-50 bg-gray-200 cursor-not-allowed";
        }
        return "bg-white";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCourses.length > 0) {
            onNext();
        } else {
            setError("Debe seleccionar al menos un curso.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Selección de Cursos</h2>
            <p className="text-gray-600 mb-6">Seleccione hasta 3 cursos de actualización. Los cursos están organizados por periodo.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Cursos seleccionados: {selectedCourses.length} / 3</p>
            </div>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${getCourseCardClass(course)} ${course.period === 'PERIODO_1' ? 'border-teal-300 hover:border-teal-500 bg-teal-50' : 'border-indigo-300 hover:border-indigo-500 bg-indigo-50'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-grow pr-2">
                                <h3 className="font-bold text-sm text-gray-800">{course.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Fechas: {course.dates}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedCourses.some(c => c.id === course.id)}
                                readOnly
                                className="form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-8 flex justify-between">
                    <button type="button" onClick={onBack} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Regresar</button>
                    <button type="submit" className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900">Continuar</button>
                </div>
            </form>
        </div>
    );
};

interface Step3Props {
    formData: FormData;
    courses: Course[];
    onBack: () => void;
    onSubmit: () => Promise<void>;
}

const Step3Confirmation: React.FC<Step3Props> = ({ formData, courses, onBack, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit();
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirmación de Registro</h2>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumen de su Registro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p><strong>Nombre: </strong>{formData.fullName}</p>
                        <p><strong>CURP: </strong>{formData.curp}</p>
                        <p><strong>Género: </strong>{formData.gender}</p>
                    </div>
                    <div>
                        <p><strong>Email: </strong>{formData.email}</p>
                        <p><strong>Departamento: </strong>{formData.department}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Cursos Seleccionados</h3>
                <div className="space-y-4">
                    {courses.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-800">{course.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                <div><strong>Horario: </strong>{course.schedule}</div>
                                <div><strong>Lugar: </strong>{course.location}</div>
                                <div><strong>Fechas: </strong>{course.dates}</div>
                                <div><strong>Horas: </strong>{course.hours || 30}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400" disabled={isSubmitting}>
                    Regresar
                </button>
                <button onClick={handleSubmit} className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900 flex items-center justify-center" disabled={isSubmitting}>
                    {isSubmitting && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? 'Procesando...' : 'Confirmar Registro'}
                </button>
            </div>
        </div>
    );
};

interface Step4Props {
    registrationResult: RegistrationResult[];
    applicantName: string;
}

const Step4Success: React.FC<Step4Props> = ({ registrationResult, applicantName }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">¡Registro Exitoso!</h2>
            <p className="mt-2 text-gray-600">
                Gracias, <strong>{applicantName}</strong>. Tu solicitud de inscripción ha sido procesada correctamente.
            </p>
            <div className="mt-6 text-left border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles de la Inscripción:</h3>
                <ul className="space-y-3">
                    {registrationResult.map((result) => (
                        <li key={result.registrationId} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                            <p className="font-semibold text-gray-800">{result.courseName}</p>
                            <p className="text-sm text-gray-500">Folio: <span className="font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">{result.registrationId}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8 border-t pt-6">
                <p className="text-sm text-gray-500">
                    El proceso ha finalizado. Puede cerrar esta ventana de forma segura.
                </p>
            </div>
        </div>
    );
};

// =============================================================================
// == MAIN APP COMPONENT (from App.tsx)
// =============================================================================
const initialFormData: FormData = {
    fullName: '',
    curp: '',
    email: '',
    gender: 'Mujer',
    department: '',
    selectedCourses: []
};

const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [registrationResult, setRegistrationResult] = useState<RegistrationResult[]>([]);

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [teachersData, coursesData, departmentsData] = await Promise.all([
                    getTeachers(),
                    getCourses(),
                    getDepartments()
                ]);
                setTeachers(teachersData);
                setCourses(coursesData);
                setDepartments(departmentsData);
            } catch (err) {
                setError("No se pudieron cargar los datos necesarios para la inscripción. Por favor, intente de nuevo más tarde.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const steps = ["Información Personal", "Selección de Cursos", "Confirmación", "Registro Exitoso"];

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async () => {
        const submissionData: SubmissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            selectedCourses: selectedCourses.map(c => ({
                id: c.id,
                name: c.name,
                dates: c.dates,
                location: c.location,
                schedule: c.schedule,
            })),
        };

        const updatedFormData = { ...formData, selectedCourses: selectedCourses.map(c => c.id) };
        setFormData(updatedFormData);

        try {
            const result = await submitRegistration(submissionData);
            setRegistrationResult(result);
            handleNext();
        } catch (error) {
            console.error("Error submitting registration:", error);
            setError("Hubo un error al procesar su registro. Intente de nuevo.");
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1PersonalInfo formData={formData} setFormData={setFormData} departments={departments} teachers={teachers} onNext={handleNext} />;
            case 2:
                return <Step2CourseSelection courses={courses} selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Step3Confirmation formData={formData} courses={selectedCourses} onBack={handleBack} onSubmit={handleSubmit} />;
            case 4:
                return <Step4Success registrationResult={registrationResult} applicantName={formData.fullName} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Stepper currentStep={currentStep} steps={steps} />
                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-700">Cargando datos...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    ) : (
                        renderStep()
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

// =============================================================================
// == RENDER APP (from original index.tsx)
// =============================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount the app");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);