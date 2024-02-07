import CreateSeatsEditor from "./editor.component";
import CreateSeatMapTable from "./table.component";
import typeOfCreateSeatsTypesParams from "./type/createSeatsType";
import "../../css/createSeats.css";
import { useEffect, useState } from "react";
import typeOfSeats from "./type/seatsType";
import typeOfSeat from "./type/seatType";
import { Radio } from "antd";
import typeOfArea from "./type/areaType";
import { v4 as uuid } from "uuid";
import SeatDetails from "./seatDetails.component";
import typeOfStage from "./type/stage";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import postDataJson from "../connection/postDataJson";

const CreateSeats = ({
  inSeats,
  inStages,
  inStatus,
  inBackground,
  inName,
  inIsSector,
  inOriginalColor,
  id,
}: typeOfCreateSeatsTypesParams) => {
  const [idOfVenue, setIdOfVenue] = useState<string>(id ? id : "");
  const [watchingGroup, setWatchingGroup] = useState<string>("");
  const [seats, setSeats] = useState<typeOfSeats>(
    inSeats && inSeats.length ? inSeats : [],
  );
  const [seatsInLine, setSeatsInLine] = useState<Array<typeOfSeat>>();
  const [background, setBackground] = useState(
    inBackground ? inBackground : "",
  );
  const [status, setStatus] = useState<"move" | "edit" | "create" | "drag">(
    inStatus ? inStatus : "move",
  );
  const [widthOfSeat, setWidthOfSeat] = useState<number>(10);
  const [heightOfSeat, setHeightOfSeat] = useState<number>(10);
  const [spaceBetweenTheSeats, setSpaceBetweenTheSeats] = useState<number>(10);
  const [spaceUnderTheSeats, setSpaceUnderTheSeats] = useState<number>(10);
  const [selectedSeats, setSelectedSeats] = useState<Array<string>>([]);
  const [typeOfSeatNumber, setTypeOfSeatNumber] = useState<boolean>(false);
  const [typeOfRowNumber, setTypeOfRowNumber] = useState<boolean>(false);
  const [seatName, setSeatName] = useState<string>("szék");
  const [rowName, setRowName] = useState<string>("sor");
  const [area, setArea] = useState<typeOfArea>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    width: 0,
    height: 0,
  });
  const [sector, setSector] = useState<string>("");
  const [isSector, setIsSector] = useState<boolean>(
    inIsSector ? inIsSector : true,
  );
  const [originalColor, setOriginalColor] = useState<boolean>(
    inOriginalColor ? inOriginalColor : false,
  );
  const [stageName, setStageName] = useState<string>("");
  const [stages, setStages] = useState<Array<typeOfStage>>(
    inStages && inStages.length ? inStages : [],
  );
  const [attention, setAttention] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [startCounting, setStartCounting] = useState<number>(1);
  const [nameOfArea, setNameOfArea] = useState<string>(inName ? inName : "");
  const [saveing, setSaveing] = useState(false);
  const [success, setSuccess] = useState("");
  const [state, setState] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const [opendSeat, setOpendSeat] = useState<typeOfSeat | false>(false);

  const romanize = (num: number) => {
    if (isNaN(num)) return NaN;
    var digits: any = String(+num).split(""),
      key = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
      ],
      roman = "",
      i = 3;

    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  };

  interface Color {
    red: number;
    green: number;
    blue: number;
  }

  const generateRandomLightColor: () => Color = () => {
    const hue = Math.random() * 360;
    const saturation = 0.8;
    const lightness = 0.8;

    const red = Math.round(
      Math.min(255, Math.max(0, lightness + saturation * Math.cos(hue / 120))) *
        255,
    );
    const green = Math.round(
      Math.min(
        255,
        Math.max(0, lightness + saturation * Math.cos((hue + 240) / 120)),
      ) * 255,
    );
    const blue = Math.round(
      Math.min(
        255,
        Math.max(0, lightness + saturation * Math.cos((hue + 480) / 120)),
      ) * 255,
    );

    return { red, green, blue };
  };

  const save = () => {
    setSaveing(true);
    let sendDatas = {
      seats: seats,
      background: background,
      status: status,
      isSector: isSector,
      originalColor: originalColor,
      stages: stages,
      name: nameOfArea,
    };
    postDataJson(`/upload-venue${id ? `/${id}` : ""}`, {
      token: ParseLocalStorage("long_token"),
      datas: sendDatas,
    }).then((request) => {
      if (request.error) {
        setError(request.message);
      } else {
        setSuccess("Sikeres mentés");
      }
      setSaveing(false);
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Backspace" || event.key === "Delete") {
        deleteSelectedSeats();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [seats, selectedSeats, stages]);

  const newSeats = (rows: number, columns: number) => {
    if (!watchingGroup) {
      if (isSector) {
        let l: typeOfSeats = [...seats];
        let seat: Array<Array<typeOfSeat>> = [];
        for (let i = 0; i < columns; i++) {
          let l = [];
          for (let j = 0; j < rows; j++) {
            l.push({
              id: uuid(),
              indexX: j,
              indexY: i,
              size: { width: widthOfSeat, height: heightOfSeat },
              color: "black",
              x:
                (area.startX - state.translation.x) * (1 / state.scale) +
                j * (widthOfSeat + spaceBetweenTheSeats),
              y:
                (area.startY - state.translation.y) * (1 / state.scale) +
                i * (heightOfSeat + spaceUnderTheSeats),
              nameDatas: {
                seatName: seatName,
                rowName: rowName,
                typeOfRowNumber: typeOfRowNumber,
                typeOfSeatNumber: typeOfSeatNumber,
              },
              name: `${sector} ${typeOfRowNumber ? romanize(i + 1) : i + 1}. ${rowName} ${typeOfSeatNumber ? romanize(j + startCounting) : j + startCounting}. ${seatName}`,
            });
          }
          if (l.length) seat.push(l);
        }
        if (seat.length) {
          l.push({
            sector: {
              startCounting: startCounting,
              rotated: 0,
              color: generateRandomLightColor(),
              type: isSector ? "seat" : "stage",
              seatName: seatName,
              rowName: rowName,
              rowType: typeOfRowNumber,
              seatType: typeOfSeatNumber,
              id: uuid(),
              name: sector ? sector : "Névtelen",
              direction: "right",
            },
            seats: seat,
          });
          if (seats.length && sector === seats[seats.length - 1]?.sector?.name)
            setAttention("A szektor neve megegyezik az előző szektor nevével!");
          if (!sector) setAttention("Ajánlott minden szektornak nevet adni");
        }
        setSeats(l);
      } else {
        if (area.width > 10 && area.height > 10) {
          let l = [...stages];
          l.push({
            name: stageName ? stageName : "Színpad",
            id: uuid(),
            borderRadius: { bottom: 0, top: 0, right: 0, left: 0 },
            title: false,
            x: (area.startX - state.translation.x) * (1 / state.scale),
            y: (area.startY - state.translation.y) * (1 / state.scale),
            width: area.width * (1 / state.scale),
            height: area.height * (1 / state.scale),
            color: "black",
            editColor: generateRandomLightColor(),
          });
          setStages(l);
        }
      }
    }
  };

  const deleteSelectedSeats = () => {
    if (true) {
      let newSeats: any = [];
      let lambda = [...seats];
      lambda.forEach((seatGroups) => {
        let l: any = [];
        seatGroups?.seats?.forEach((seatList) => {
          let lSeats = seatList.filter(
            (seat) => !selectedSeats.includes(seat.id),
          );
          if (lSeats.length) l.push(lSeats);
        });
        if (l.length) newSeats.push({ sector: seatGroups.sector, seats: l });
      });
      //let lStages:Array<typeOfStage> = [];
      let l = stages.filter((stage) => !selectedSeats.includes(stage.id));
      setSeats(newSeats);
      setStages(l);
    }
  };

  const dragSelectedSeats = ({
    dx,
    dy,
    x,
    y,
  }: {
    dx: number;
    dy: number;
    x: number;
    y: number;
  }) => {
    if (status === "drag") {
      let l = [...seats];
      for (let i = 0; i < l.length; i++) {
        for (let j = 0; j < l[i]?.seats.length; j++) {
          for (let k = 0; k < l[i]?.seats[j]?.length; k++) {
            if (
              l[i].seats[j][k] &&
              selectedSeats &&
              selectedSeats.includes(l[i].seats[j][k].id)
            ) {
              l[i].seats[j][k].x -= dx;
              l[i].seats[j][k].y -= dy;
            }
          }
        }
      }
      setSeats(l);
    }
  };

  const selectSeat = ({ id }: { id: string }) => {
    for (let i = 0; i < seats.length; i++) {
      for (let k = 0; k < seats[i].seats.length; k++) {
        let l = seats[i].seats[k].filter((item) => {
          return item.id === id;
        });
        if (l[0]) return setOpendSeat(l[0]);
      }
    }
  };

  const editSeat = ({ name }: { name: string }) => {
    let l = [...seats];
    l.forEach((seatList, i) => {
      seatList.seats.forEach((seatList2, j) => {
        seatList2.forEach((seat, k) => {
          if (opendSeat && seat.id === opendSeat.id) {
            seat.name = name;
          }
        });
      });
    });
    setSeats(l);
    setSelectedSeats([]);
    setOpendSeat(false);
  };

  const changeStairs = (direction: boolean) => {
    let l = [...seats];
    l.forEach((seatGroup) => {
      if (seatGroup.sector.id === watchingGroup) {
        seatGroup.seats.forEach((seatList1, i) => {
          seatList1.forEach((seatList2, j) => {
            direction ? (seatList2.y += j * 0.2) : (seatList2.y -= j * 0.2);
          });
        });
      }
    });
    setSeats(l);
  };

  const setDirectionOfSeats = (
    idOfGroup: string,
    direction: "left" | "right" | "top" | "bottom",
  ) => {
    let newSeats: typeOfSeats = [];
    seats.forEach((seatGroup) => {
      if (seatGroup.sector.id === idOfGroup) {
        if (
          (direction === "right" || direction === "left") &&
          (seatGroup.sector.direction === "right" ||
            seatGroup.sector.direction === "left") &&
          seatGroup.sector.direction !== direction
        ) {
          let s: Array<Array<typeOfSeat>> = [];
          seatGroup.seats.forEach((seatList, row) => {
            seatList.reverse();
            s.push([]);
            seatList.forEach((seat, i) => {
              s[s.length - 1].push(seat);
              s[s.length - 1][i].name =
                `${seatGroup.sector.name} ${typeOfRowNumber ? romanize(row + 1) : row + 1}. ${seat.nameDatas?.rowName} ${typeOfSeatNumber ? romanize(i + seatGroup.sector.startCounting) : i + seatGroup.sector.startCounting}. ${seat?.nameDatas?.seatName}`;
            });
          });
          newSeats.push({ sector: seatGroup.sector, seats: s });
          newSeats[newSeats.length - 1].sector.direction = direction;
        } else if (
          seatGroup.sector.direction === "left" ||
          seatGroup.sector.direction === "right"
        ) {
          if (seatGroup.sector.rotated - 90 === 0) seatGroup.sector.rotated = 0;
          else seatGroup.sector.rotated += -90;
          newSeats.push({
            sector: seatGroup.sector,
            seats:
              (seatGroup.sector.rotated % 270 === 0 &&
                seatGroup.sector.rotated % 540 !== 0) ||
              seatGroup.sector.rotated % 360 === 0
                ? rotateSeatsToRight(seatGroup.seats, seatGroup.sector)
                : rotateSeatsToLeft(seatGroup.seats, seatGroup.sector),
          });
        } else if (
          seatGroup.sector.direction === "left" ||
          seatGroup.sector.direction === "right"
        ) {
          if (seatGroup.sector.rotated + 90 === 360)
            seatGroup.sector.rotated = 0;
          else seatGroup.sector.rotated += 90;
          newSeats.push({
            sector: seatGroup.sector,
            seats:
              seatGroup.sector.rotated % 90 === 0 &&
              seatGroup.sector.rotated % 180 !== 0
                ? rotateSeatsToLeft(seatGroup.seats, seatGroup.sector)
                : rotateSeatsToRight(seatGroup.seats, seatGroup.sector),
          });
        } else {
          newSeats.push(seatGroup);
        }
      } else {
        newSeats.push(seatGroup);
      }
    });
    setSeats(newSeats);
  };

  const rotateSeatsToLeft = (list: Array<Array<typeOfSeat>>, sector: any) => {
    let newList: Array<Array<typeOfSeat>> = [];
    let maxIndex: number = 0;
    for (let i = 0; i < list.length; i++) {
      if (maxIndex < list[i].length) maxIndex = list[i].length;
    }
    let rowIndex = 0;
    for (let i = 0; i < maxIndex; i++) {
      let items: Array<typeOfSeat> = [];
      let seatIndex = 0;
      list.reverse();
      list.forEach((item) => {
        if (item[i]) {
          item[i].name =
            `${sector.name} ${item[i].indexX + 1}. ${item[i].nameDatas?.rowName} ${(item[i].indexY + sector.startCounting - 1) * -1 + list.length}. ${item[i].nameDatas?.seatName}`;
          items.push(item[i]);
          let lX = item[i].indexX;
          item[i].indexX = item[i].indexY;
          item[i].indexY = lX;
          seatIndex++;
        }
      });
      if (items.length) {
        newList.push(items);
      }
      rowIndex++;
    }
    return newList;
  };

  const rotateSeatsToRight = (list: Array<Array<typeOfSeat>>, sector: any) => {
    let newList: Array<Array<typeOfSeat>> = [];
    let maxIndex: number = 0;
    for (let i = 0; i < list.length; i++) {
      if (maxIndex < list[i].length) maxIndex = list[i].length;
    }
    let rowIndex = 0;
    for (let i = maxIndex - 1; i >= 0; i--) {
      let items: Array<typeOfSeat> = [];
      let seatIndex = 0;
      list.forEach((item) => {
        if (item[i]) {
          item[i].name =
            `${sector.name} ${item[i].indexX * -1 + maxIndex}. ${item[i].nameDatas?.rowName} ${item[i].indexY + sector.startCounting}. ${item[i].nameDatas?.seatName}`;
          items.push(item[i]);
          let lX = item[i].indexX;
          item[i].indexX = item[i].indexY;
          item[i].indexY = lX;
          seatIndex++;
        }
      });
      if (items.length) {
        newList.push(items);
      }
      rowIndex++;
    }
    return newList;
  };

  return (
    <div className="create-seat-main-div">
      <div className="status-changer">
        <Radio.Group
          defaultValue={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <Radio.Button value="create">
            <i className="fas fa-th"></i>
          </Radio.Button>
          <Radio.Button value="edit">
            <i className="fas fa-edit"></i>
          </Radio.Button>
          <Radio.Button value="move">
            <i className="fas fa-mouse-pointer"></i>
          </Radio.Button>
          <Radio.Button value="drag">
            <i className="far fa-hand-rock"></i>
          </Radio.Button>
        </Radio.Group>
      </div>
      {attention ? (
        <Snackbar
          open={!!attention}
          autoHideDuration={6000}
          onClose={() => {
            setAttention("");
          }}
          action={<></>}
        >
          <Alert severity="warning" onClose={() => setAttention("")}>
            <div>
              <AlertTitle>Figyelmeztetés</AlertTitle>
              {attention}
            </div>
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      {error ? (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => {
            setAttention("");
          }}
          action={<></>}
        >
          <Alert severity="error" onClose={() => setError("")}>
            <div>
              <AlertTitle>Hiba</AlertTitle>
              {error}
            </div>
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      {success ? (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => {
            setAttention("");
          }}
          action={<></>}
        >
          <Alert severity="success" onClose={() => setError("")}>
            <div>{error}</div>
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      <SeatDetails
        editSeat={editSeat}
        setSeat={setOpendSeat}
        seat={opendSeat}
      />
      <CreateSeatMapTable
        isSelecting={status === "edit"}
        setError={setError}
        stages={stages}
        isSector={isSector}
        originalColor={originalColor}
        watchingGroup={watchingGroup}
        setSelectedSeat={selectSeat}
        dragSelectedSeats={dragSelectedSeats}
        setSelectedSeats={setSelectedSeats}
        selectedSeats={selectedSeats}
        setState={setState}
        state={state}
        newSeats={newSeats}
        area={area}
        setArea={setArea}
        heightOfSeats={heightOfSeat}
        widthOfSeats={widthOfSeat}
        spaceBetweenTheSeats={spaceBetweenTheSeats}
        spaceUnderTheSeats={spaceUnderTheSeats}
        status={status}
        background={background}
        seats={seats}
      />
      <CreateSeatsEditor
        saveing={saveing}
        save={save}
        nameOfArea={nameOfArea}
        setNameOfArea={setNameOfArea}
        startCounting={startCounting}
        setStartCounting={setStartCounting}
        setError={setError}
        setDirectionOfSeats={setDirectionOfSeats}
        stages={stages}
        originalColor={originalColor}
        setOriginalColor={setOriginalColor}
        setIsSector={setIsSector}
        isSector={isSector}
        changeStairs={changeStairs}
        setWatchingGroup={setWatchingGroup}
        watchingGroup={watchingGroup}
        seats={seats}
        setRowName={setRowName}
        setSeatName={setSeatName}
        setTypeOfRowNumber={setTypeOfRowNumber}
        setTypeOfSeatNumber={setTypeOfSeatNumber}
        rowName={rowName}
        seatName={seatName}
        typeOfRowNumber={typeOfRowNumber}
        typeOfSeatNumber={typeOfSeatNumber}
        heightOfSeats={heightOfSeat}
        setHeightOfSeats={setHeightOfSeat}
        widthOfSeats={widthOfSeat}
        setWidthOfSeats={setWidthOfSeat}
        spaceBetweenTheSeats={spaceBetweenTheSeats}
        setSpaceBetweenTheSeats={setSpaceBetweenTheSeats}
        setSpaceUnderTheSeats={setSpaceUnderTheSeats}
        spaceUnderTheSeats={spaceUnderTheSeats}
        setStatus={setSeats}
        setBackground={setBackground}
        deleteBackground={() => {
          setBackground("");
        }}
        background={background}
        sector={sector}
        setSector={setSector}
      />
    </div>
  );
};

export default CreateSeats;
