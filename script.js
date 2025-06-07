let matrices = {};

function addMatrix() {
  const name = document.getElementById("matrixName").value.trim();
  const values = document.getElementById("matrixValues").value;

  if (!name || !values) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const parsed = JSON.parse(values);
    const matrix = math.matrix(parsed);
    matrices[name] = matrix;

    updateMatrixList();
    updateMatrixSelect();

    document.getElementById("matrixName").value = "";
    document.getElementById("matrixValues").value = "";
  } catch (err) {
    alert("Formato inválido! Use: [[1,2],[3,4]]");
  }
}

function updateMatrixList() {
  const container = document.getElementById("matricesList");
  container.innerHTML = "";

  Object.keys(matrices).forEach(name => {
    const box = document.createElement("div");
    box.className = "matrix-box";

    const title = document.createElement("strong");
    title.textContent = `Matriz ${name}:`;
    box.appendChild(title);

    const pre = document.createElement("pre");
    pre.innerHTML = matrixToHTML(matrices[name]._data);
    box.appendChild(pre);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => {
      delete matrices[name];
      updateMatrixList();
      updateMatrixSelect();
    };
    box.appendChild(delBtn);

    container.appendChild(box);
  });
}

function updateMatrixSelect() {
  const select = document.getElementById("selectedMatrices");
  select.innerHTML = "";

  Object.keys(matrices).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.text = name;
    select.appendChild(opt);
  });
}

function performOperation(type) {
  const selected = Array.from(document.getElementById("selectedMatrices").selectedOptions).map(opt => opt.value);

  if (selected.length < 2) {
    alert("Selecione pelo menos duas matrizes.");
    return;
  }

  try {
    let result = matrices[selected[0]];

    for (let i = 1; i < selected.length; i++) {
      if (type === "add") result = math.add(result, matrices[selected[i]]);
      else if (type === "subtract") result = math.subtract(result, matrices[selected[i]]);
      else if (type === "multiply") result = math.multiply(result, matrices[selected[i]]);
    }

    document.getElementById("result").innerHTML = matrixToHTML(result._data);
  } catch (err) {
    document.getElementById("result").textContent = "Erro ao calcular: " + err.message;
  }
}

function solveSystem() {
  const A = document.getElementById("matrixA").value;
  const B = document.getElementById("matrixB").value;

  try {
    const matrixA = math.matrix(JSON.parse(A));
    const matrixB = math.matrix(JSON.parse(B));
    const solution = math.lusolve(matrixA, matrixB);
    document.getElementById("result").innerHTML = matrixToHTML(solution._data);
  } catch (err) {
    document.getElementById("result").textContent = "Erro ao resolver: " + err.message;
  }
}

function matrixToHTML(data) {
  return `
    <table style="border-collapse: collapse;">
      ${data.map(row => `
        <tr>${row.map(val => `<td style="border: 1px solid #ccc; padding: 6px;">${val}</td>`).join("")}</tr>
      `).join("")}
    </table>
  `;
}
