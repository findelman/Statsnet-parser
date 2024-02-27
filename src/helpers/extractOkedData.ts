export const extractOkedData = (htmlData) => {
  const okedData = [];

  const kindOfActivities = htmlData(".kind_of_activity");

  kindOfActivities.each((index, element) => {
    const $element = htmlData(element);
    const $parentDiv = $element.next(
      ".grid.grid-cols-12.col-span-full.gap-0.mb-4"
    );
    const okedNumber = $parentDiv.find("span:first-child").text().trim();
    const okedDescription = $parentDiv.find("span:last-child").text().trim();
    okedData.push({ number: okedNumber, description: okedDescription });
  });

  return okedData;
};
